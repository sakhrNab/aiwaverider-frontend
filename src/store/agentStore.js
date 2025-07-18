import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { fetchAgents, getAgentsCount, getSearchResultsCount } from '../api/marketplace/agentApi'; //fetchWishlists
import { fixPlaceholderUrl } from '../utils/imageUtils';
import freeSearchService from '../services/freeSearchService';

// Helper to fix any via.placeholder.com URLs at runtime
const fixPlaceholderUrls = (agents) => {
  if (!agents || !Array.isArray(agents)) return agents;
  
  return agents.map(agent => {
    // Create a copy to avoid mutating the original
    const fixedAgent = { ...agent };
    
    // Fix imageUrl using our utility function
    if (fixedAgent.imageUrl) { //TODO: fixedAgent.image.url
      fixedAgent.imageUrl = fixPlaceholderUrl(fixedAgent.imageUrl);
    } else if (!fixedAgent.imageUrl) {
      // Generate a default placeholder if no image URL exists
      fixedAgent.imageUrl = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%233498db'/%3E%3Ctext x='150' y='100' font-family='Arial' font-size='16' text-anchor='middle' dominant-baseline='middle' fill='%23ffffff'%3E${encodeURIComponent(fixedAgent.name || 'Agent')}%3C/text%3E%3C/svg%3E`;
    }
    
    // Fix iconUrl using our utility function
    if (fixedAgent.iconUrl) {
      fixedAgent.iconUrl = fixPlaceholderUrl(fixedAgent.iconUrl);
    } else if (!fixedAgent.iconUrl) {
      // Generate a default icon placeholder if no icon URL exists
      const initial = fixedAgent.name ? fixedAgent.name.charAt(0).toUpperCase() : 'A';
      fixedAgent.iconUrl = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%234a69bd'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='40' font-weight='bold' text-anchor='middle' dominant-baseline='middle' fill='%23ffffff'%3E${initial}%3C/text%3E%3C/svg%3E`;
    }
    
    return fixedAgent;
  });
};

// Add a new variable to track API request state at the top of the file
let pendingRequest = null;
let currentLoadId = null;
let lastSuccessfulFetchTime = null;

const useAgentStore = create(
  devtools(
    (set, get) => ({
      // State
      agents: [],
      allAgents: [],
      featuredAgents: [],
      recommendedAgents: [],
      // wishlists: [],
      selectedCategory: 'All',
      selectedFilter: 'Hot & New',
      selectedPrice: { min: 0, max: 1000 },
      selectedRating: 0,
      selectedTags: [],
      selectedFeatures: [],
      searchQuery: '',
      isLoading: true,
      isRecommendationsLoading: true,
      tagCounts: {},
      featureCounts: {},
      lastLoadTime: null, // Track when data was last loaded
      cacheExpiry: 30 * 60 * 1000, // Increase cache to 30 minutes
      
      // Pagination state
      pagination: {
        currentPage: 1,
        pageSize: 25,
        totalItems: 0,
        totalPages: 1,
        hasMore: false,
        lastVisibleId: null,
        isLoadingMore: false
      },
      
      // Review management actions
      addReviewToAgent: (agentId, newReview) => {
        console.log(`Adding review to agent ${agentId} in store`, newReview);
        const { agents, allAgents } = get();
        
        // Update the main agents array
        const updatedAgents = agents.map(agent => {
          if (agent.id === agentId || agent._id === agentId) {
            // Add the new review to the reviews array
            const updatedReviews = [...(agent.reviews || []), newReview];
            
            // Recalculate the rating
            let updatedRating = { ...agent.rating } || { average: 0, count: 0 };
            if (updatedReviews.length > 0) {
              const sum = updatedReviews.reduce((acc, review) => acc + (parseFloat(review.rating) || 0), 0);
              updatedRating.average = sum / updatedReviews.length;
              updatedRating.count = updatedReviews.length;
            }
            
            return { 
              ...agent, 
              reviews: updatedReviews,
              rating: updatedRating
            };
          }
          return agent;
        });
        
        // Also update the allAgents array
        const updatedAllAgents = allAgents.map(agent => {
          if (agent.id === agentId || agent._id === agentId) {
            // Add the new review to the reviews array
            const updatedReviews = [...(agent.reviews || []), newReview];
            
            // Recalculate the rating
            let updatedRating = { ...agent.rating } || { average: 0, count: 0 };
            if (updatedReviews.length > 0) {
              const sum = updatedReviews.reduce((acc, review) => acc + (parseFloat(review.rating) || 0), 0);
              updatedRating.average = sum / updatedReviews.length;
              updatedRating.count = updatedReviews.length;
            }
            
            return { 
              ...agent, 
              reviews: updatedReviews,
              rating: updatedRating
            };
          }
          return agent;
        });
        
        // Update the store
        set({
          agents: updatedAgents,
          allAgents: updatedAllAgents
        });
      },
      
      // Update all reviews for an agent (for refreshing page)
      updateAgentReviews: (agentId, reviews) => {
        console.log(`Updating all reviews for agent ${agentId} in store`, reviews.length);
        const { agents, allAgents } = get();
        
        // Update the main agents array
        const updatedAgents = agents.map(agent => {
          if (agent.id === agentId || agent._id === agentId) {
            // Calculate new rating average
            let updatedRating = { ...agent.rating } || { average: 0, count: 0 };
            if (reviews.length > 0) {
              const sum = reviews.reduce((acc, review) => acc + (parseFloat(review.rating) || 0), 0);
              updatedRating.average = sum / reviews.length;
              updatedRating.count = reviews.length;
            } else {
              updatedRating.average = 0;
              updatedRating.count = 0;
            }
            
            return { 
              ...agent, 
              reviews: reviews,
              rating: updatedRating
            };
          }
          return agent;
        });
        
        // Also update the allAgents array
        const updatedAllAgents = allAgents.map(agent => {
          if (agent.id === agentId || agent._id === agentId) {
            // Calculate new rating average
            let updatedRating = { ...agent.rating } || { average: 0, count: 0 };
            if (reviews.length > 0) {
              const sum = reviews.reduce((acc, review) => acc + (parseFloat(review.rating) || 0), 0);
              updatedRating.average = sum / reviews.length;
              updatedRating.count = reviews.length;
            } else {
              updatedRating.average = 0;
              updatedRating.count = 0;
            }
            
            return { 
              ...agent, 
              reviews: reviews,
              rating: updatedRating
            };
          }
          return agent;
        });
        
        // Update the store
        set({
          agents: updatedAgents,
          allAgents: updatedAllAgents
        });
      },
      
      removeReviewFromAgent: (agentId, reviewId) => {
        console.log(`Removing review ${reviewId} from agent ${agentId} in store`);
        const { agents, allAgents } = get();
        
        // Update the main agents array
        const updatedAgents = agents.map(agent => {
          if (agent.id === agentId || agent._id === agentId) {
            // Filter out the deleted review
            const updatedReviews = agent.reviews?.filter(review => review.id !== reviewId) || [];
            
            // Recalculate the rating
            let updatedRating = { ...agent.rating } || { average: 0, count: 0 };
            if (updatedReviews.length > 0) {
              const sum = updatedReviews.reduce((acc, review) => acc + (parseFloat(review.rating) || 0), 0);
              updatedRating.average = sum / updatedReviews.length;
              updatedRating.count = updatedReviews.length;
            } else {
              updatedRating.average = 0;
              updatedRating.count = 0;
            }
            
            return { 
              ...agent, 
              reviews: updatedReviews,
              rating: updatedRating
            };
          }
          return agent;
        });
        
        // Also update the allAgents array
        const updatedAllAgents = allAgents.map(agent => {
          if (agent.id === agentId || agent._id === agentId) {
            // Filter out the deleted review
            const updatedReviews = agent.reviews?.filter(review => review.id !== reviewId) || [];
            
            // Recalculate the rating
            let updatedRating = { ...agent.rating } || { average: 0, count: 0 };
            if (updatedReviews.length > 0) {
              const sum = updatedReviews.reduce((acc, review) => acc + (parseFloat(review.rating) || 0), 0);
              updatedRating.average = sum / updatedReviews.length;
              updatedRating.count = updatedReviews.length;
            } else {
              updatedRating.average = 0;
              updatedRating.count = 0;
            }
            
            return { 
              ...agent, 
              reviews: updatedReviews,
              rating: updatedRating
            };
          }
          return agent;
        });
        
        // Update the store
        set({
          agents: updatedAgents,
          allAgents: updatedAllAgents
        });
      },
      
      // Actions
      setAgents: (agents) => set({ agents }),
      setAllAgents: (allAgents) => set({ allAgents }),
      setFeaturedAgents: (featuredAgents) => set({ featuredAgents }),
      setRecommendedAgents: (recommendedAgents) => set({ recommendedAgents }),
      // setWishlists: (wishlists) => set({ wishlists }),
      setCategory: (category) => set({ selectedCategory: category }),
      setFilter: (filter) => set({ selectedFilter: filter }),
      setPrice: (price) => set({ selectedPrice: price }),
      setRating: (rating) => set({ selectedRating: rating }),
      setTags: (tags) => set({ selectedTags: tags }),
      setFeatures: (features) => set({ selectedFeatures: features }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setLoading: (isLoading) => set({ isLoading }),
      setRecommendationsLoading: (isLoading) => set({ isRecommendationsLoading: isLoading }),
      setTagCounts: (tagCounts) => set({ tagCounts }),
      setFeatureCounts: (featureCounts) => set({ featureCounts }),
      
      // New method to refresh data after mutations (add/edit/delete)
      refreshAfterMutation: async () => {
        console.log('Refreshing agent store after mutation');
        // Clear the lastLoadTime to force a refresh
        set({ lastLoadTime: null });
        // Call loadInitialData with forceRefresh to get fresh data
        await get().loadInitialData(true);
      },
      
      // Method to fetch and update total count for current category
      updateTotalCount: async (category = null) => {
        try {
          const totalCount = await getAgentsCount(category);
          const { pagination } = get();
          
          console.log(`📊 Updated total count: ${totalCount} for category: ${category || 'All'}`);
          
          set({
            pagination: {
              ...pagination,
              totalItems: totalCount,
              totalPages: Math.ceil(totalCount / pagination.pageSize)
            }
          });
          
          return totalCount;
        } catch (error) {
          console.error('Error updating total count:', error);
          return 0;
        }
      },
      
      // Toggle a tag selection
      toggleTag: (tag) => set((state) => ({
        selectedTags: state.selectedTags.includes(tag) 
          ? state.selectedTags.filter(t => t !== tag)
          : [...state.selectedTags, tag]
      })),
      
      // Toggle a feature selection
      toggleFeature: (feature) => set((state) => ({
        selectedFeatures: state.selectedFeatures.includes(feature)
          ? state.selectedFeatures.filter(f => f !== feature)
          : [...state.selectedFeatures, feature]
      })),
      
      // Reset all filters
      resetFilters: () => set({
        selectedCategory: 'All',
        selectedFilter: 'Hot & New',
        selectedPrice: { min: 0, max: 1000 },
        selectedRating: 0,
        selectedTags: [],
        selectedFeatures: [],
        searchQuery: ''
      }),
      
      // Calculate filter counts
      calculateFilterCounts: (agents) => {
        if (!agents || agents.length === 0) return;
        
        const tagCount = {};
        const featureCount = {};
        let othersTagCount = 0;
        let othersFeatureCount = 0;
        
        // Use more efficient loops for better performance
        for (let i = 0; i < agents.length; i++) {
          const agent = agents[i];
          
          // For tags, use category or tags array if available
          if (agent.category) {
            if (agent.category.trim()) {
              const category = agent.category.trim();
              tagCount[category] = (tagCount[category] || 0) + 1;
            } else {
              // Count empty categories as "Others"
              othersTagCount++;
            }
          }
          
          let hasValidTag = false;
          if (agent.tags && Array.isArray(agent.tags)) {
            for (let j = 0; j < agent.tags.length; j++) {
              const tag = agent.tags[j];
              if (tag && typeof tag === 'string' && tag.trim()) {
                const trimmedTag = tag.trim();
                tagCount[trimmedTag] = (tagCount[trimmedTag] || 0) + 1;
                hasValidTag = true;
              }
            }
            // If agent has tags array but all are empty, count as "Others"
            if (agent.tags.length > 0 && !hasValidTag) {
              othersTagCount++;
            }
          }
          
          // For features, check for specific properties or use features array
          let hasValidFeature = false;
          if (agent.features && Array.isArray(agent.features)) {
            for (let j = 0; j < agent.features.length; j++) {
              const feature = agent.features[j];
              if (feature && typeof feature === 'string' && feature.trim()) {
                const trimmedFeature = feature.trim();
                featureCount[trimmedFeature] = (featureCount[trimmedFeature] || 0) + 1;
                hasValidFeature = true;
              }
            }
            // If agent has features array but all are empty, count as "Others"
            if (agent.features.length > 0 && !hasValidFeature) {
              othersFeatureCount++;
            }
          }
          
          // Count free agents
          if (agent.price === 0 || 
              agent.price === '0' || 
              agent.price === 'Free' || 
              agent.price === '$0' || 
              agent.isFree === true) {
            featureCount['Free'] = (featureCount['Free'] || 0) + 1;
          }
          
          // Count subscription agents
          if (typeof agent.price === 'string' && 
              (agent.price.includes('/month') || 
               agent.price.includes('a month') || 
               agent.price.includes('monthly') ||
               agent.price.includes('subscription'))) {
            featureCount['Subscription'] = (featureCount['Subscription'] || 0) + 1;
          }
        }
        
        // Add the "Others" category if there are any empty/invalid tags or features
        if (othersTagCount > 0) {
          tagCount['Others'] = othersTagCount;
        }
        
        if (othersFeatureCount > 0) {
          featureCount['Others'] = othersFeatureCount;
        }
        
        set({ tagCounts: tagCount, featureCounts: featureCount });
      },
      
      // Apply filters and search with intelligent dual-mode operation
      applyFilters: async (resetPagination = true) => {
        const state = get();
        const { 
          selectedCategory, 
          selectedFilter, 
          selectedPrice, 
          selectedRating, 
          selectedTags, 
          selectedFeatures, 
          searchQuery,
          pagination,
          allAgents
        } = state;
        
        console.log('🔍 ApplyFilters: Starting with Redis-First dual-mode architecture');
        console.log('🔍 Parameters:', {
          category: selectedCategory,
          filter: selectedFilter,
          search: searchQuery,
          hasAllAgents: allAgents.length,
          resetPagination
        });
        
        // **DUAL-MODE INTELLIGENCE**: Choose optimal approach based on use case
        
        // MODE 1: Category browsing with client-side filtering (Redis-First cached data)
        const shouldUseClientSideFiltering = 
          selectedCategory !== 'All' && 
          !searchQuery?.trim() && 
          allAgents.length > 0 && 
          freeSearchService.initialized;
        
        if (shouldUseClientSideFiltering) {
          console.log('🏷️ MODE 1: Using client-side filtering for category browsing');
          
          // Use FreeSearchService for instant filtering
          const searchResults = freeSearchService.searchAndFilter({
            searchQuery: '',
            category: selectedCategory,
            selectedFilter: selectedFilter,
            priceRange: selectedPrice,
            rating: selectedRating,
            tags: selectedTags,
            features: selectedFeatures,
            page: resetPagination ? 1 : pagination.currentPage,
            pageSize: pagination.pageSize
          });
          
          console.log(`✅ MODE 1: Client-side filtering completed in ${searchResults.searchTime}ms - ${searchResults.agents.length}/${searchResults.total} agents`);
          
          set({
            agents: searchResults.agents,
            isLoading: false,
            pagination: {
              ...searchResults.pagination,
              isLoadingMore: false
            }
          });
          
          return;
        }
        
        // MODE 2: Search or "All" category - Use server-side processing with smart caching
        console.log('🔍 MODE 2: Using server-side processing with smart caching');
        
        try {
          set({ isLoading: true });
          
          const lastVisibleId = resetPagination ? null : pagination.lastVisibleId;
          const isSearching = searchQuery?.trim();
          
          // SMART SEARCH CACHING LOGIC
          if (isSearching) {
            console.log('🔍 SMART CACHE: Implementing intelligent search caching');
            
            // Step 1: Get total search results count from database
            const databaseTotal = await getSearchResultsCount(searchQuery);
            console.log(`🔍 SMART CACHE: Database has ${databaseTotal} total results for "${searchQuery}"`);
            
            // Step 2: Check current cache
            const currentCachedResults = state.agents.filter(agent => {
              // Simple search match check (this could be more sophisticated)
              const agentText = `${agent.name} ${agent.description} ${agent.category}`.toLowerCase();
              return agentText.includes(searchQuery.toLowerCase());
            });
            
            console.log(`🔍 SMART CACHE: Cache has ${currentCachedResults.length} results, database has ${databaseTotal}`);
            
            // Step 3: Decide strategy based on cache vs database comparison
            let shouldFetchFromApi = true;
            let limitToUse = Math.min(databaseTotal, 50); // Don't exceed backend limit
            
            if (currentCachedResults.length >= databaseTotal && databaseTotal > 0) {
              console.log('✅ SMART CACHE: Cache is complete, using cached results');
              shouldFetchFromApi = false;
              
              // Use cached results
              set({
                agents: currentCachedResults,
                isLoading: false,
                pagination: {
                  ...pagination,
                  currentPage: 1,
                  totalItems: databaseTotal,
                  totalPages: 1,
                  hasMore: false,
                  lastVisibleId: null,
                  isLoadingMore: false
                }
              });
              
              console.log('✅ SMART CACHE: Updated store with cached results');
              return;
            } else if (databaseTotal > 0) {
              console.log(`📦 SMART CACHE: Cache incomplete (${currentCachedResults.length}/${databaseTotal}), fetching from API`);
              limitToUse = Math.min(databaseTotal, 50); // Fetch up to the total or backend limit
            } else {
              console.log('🔍 SMART CACHE: No results in database, fetching to confirm');
              limitToUse = 10; // Small limit for zero-result confirmation
            }
            
            // Step 4: Fetch from API with optimized limit
            const apiParams = {
              limit: limitToUse,
              priceRange: { min: 0, max: 1000 }, // Remove filters for comprehensive search
              rating: undefined,
              tags: [],
              features: [],
              search: searchQuery.trim()
            };
            
            console.log('🔍 SMART CACHE: API Parameters:', apiParams, `(fetching ${limitToUse} results)`);
            
            const response = await fetchAgents('All', 'Most Popular', null, apiParams);
            
            if (response && response.agents) {
              const fixedAgents = fixPlaceholderUrls(response.agents);
              
              console.log(`✅ SMART CACHE: Received ${fixedAgents.length} agents from API`);
              
              // Update store with fresh search results
              set({
                agents: fixedAgents,
                isLoading: false,
                pagination: {
                  currentPage: 1,
                  pageSize: pagination.pageSize,
                  totalItems: databaseTotal, // Use the accurate database count
                  totalPages: Math.ceil(databaseTotal / pagination.pageSize),
                  hasMore: fixedAgents.length < databaseTotal,
                  lastVisibleId: response.pagination?.lastVisibleId || null,
                  isLoadingMore: false
                }
              });
              
              console.log(`✅ SMART CACHE: Updated store with ${fixedAgents.length}/${databaseTotal} search results`);
            } else {
              // Handle API failure
              console.warn('🔍 SMART CACHE: API call failed, showing empty results');
              set({
                agents: [],
                isLoading: false,
                pagination: {
                  ...pagination,
                  totalItems: 0,
                  hasMore: false,
                  isLoadingMore: false
                }
              });
            }
            
            return;
          }
          
          // REGULAR BROWSING (non-search) - Pagination Logic
          console.log('🔍 BROWSE MODE: Using pagination-based fetching');
          
          // Step 1: Get accurate total count first
          let totalCount;
          try {
            totalCount = await getAgentsCount(selectedCategory === 'All' ? null : selectedCategory);
            console.log(`🔍 BROWSE MODE: Total count from database: ${totalCount}`);
          } catch (error) {
            console.warn('Failed to get total count, will use response total:', error);
            totalCount = null; // Will fallback to response total
          }
          
          // For proper pagination, we need to calculate offset
          const offset = (pagination.currentPage - 1) * pagination.pageSize;
          console.log(`🔍 BROWSE MODE: Page ${pagination.currentPage}, offset ${offset}, pageSize ${pagination.pageSize}`);
          
          const apiParams = {
            limit: pagination.pageSize,
            offset: offset, // Add offset for proper pagination
            priceRange: selectedPrice,
            rating: selectedRating > 0 ? selectedRating : undefined,
            tags: selectedTags,
            features: selectedFeatures,
            search: undefined
          };
          
          console.log('🔍 BROWSE MODE: API Parameters:', apiParams);
          
          const response = await fetchAgents(
            selectedCategory,
            selectedFilter,
            null, // No cursor for offset-based pagination
            apiParams
          );
          
          console.log('🔍 API Response:', {
            agentsCount: response?.agents?.length || 0,
            fromCache: response?.fromCache,
            total: response?.total,
            mode: response?.mode,
            hasMore: response?.pagination?.hasMore
          });

          if (!response || !response.agents) {
            console.warn('No data returned from fetchAgents');
            set({ 
              agents: [], 
              isLoading: false,
              pagination: {
                ...pagination,
                hasMore: false,
                lastVisibleId: null,
                isLoadingMore: false,
                totalItems: 0,
                currentPage: 1,
                totalPages: 1
              }
            });
            return;
          }

          const fixedAgents = fixPlaceholderUrls(response.agents);
          
          console.log(`✅ BROWSE MODE: Received ${fixedAgents.length} agents for page ${pagination.currentPage} (fromCache: ${response.fromCache})`);

          // Use the accurate total count we fetched, fallback to response total
          const finalTotalCount = totalCount || response.total || fixedAgents.length;
          
          // Ensure totalCount is a valid number
          const validTotalCount = typeof finalTotalCount === 'number' && !isNaN(finalTotalCount) 
            ? finalTotalCount 
            : fixedAgents.length;
            
          console.log(`🔍 BROWSE MODE: Using total count: ${validTotalCount} (from: ${totalCount ? 'database' : 'response'})`);

          // Calculate total pages based on valid total count
          const totalPages = Math.ceil(validTotalCount / pagination.pageSize);

          // For browsing mode, always replace agents (don't append)
          set({
            agents: fixedAgents,
            isLoading: false,
            pagination: {
              currentPage: pagination.currentPage,
              pageSize: pagination.pageSize,
              totalItems: validTotalCount,
              totalPages: totalPages,
              hasMore: pagination.currentPage < totalPages,
              lastVisibleId: null, // Not used in offset-based pagination
              isLoadingMore: false
            }
          });
          
          console.log(`✅ BROWSE MODE: Store updated successfully - Page ${pagination.currentPage}/${totalPages} (${validTotalCount} total agents)`);
          
        } catch (error) {
          console.error('Error in browse mode server-side processing:', error);
          
          // For browsing mode errors, try to provide reasonable fallback
          if (!searchQuery?.trim()) {
            // This is browse mode - try to get at least some agents
            try {
              // Get total count directly if we don't have it
              if (!totalCount) {
                totalCount = await getAgentsCount(selectedCategory === 'All' ? null : selectedCategory);
                console.log(`🔍 BROWSE MODE ERROR FALLBACK: Got total count: ${totalCount}`);
              }
              
              const validTotalCount = typeof totalCount === 'number' && !isNaN(totalCount) ? totalCount : 100; // Reasonable fallback
              const totalPages = Math.ceil(validTotalCount / pagination.pageSize);
              
              set({
                agents: [], // Empty for now, but with correct pagination
                isLoading: false,
                pagination: {
                  currentPage: pagination.currentPage,
                  pageSize: pagination.pageSize,
                  totalItems: validTotalCount,
                  totalPages: totalPages,
                  hasMore: pagination.currentPage < totalPages,
                  lastVisibleId: null,
                  isLoadingMore: false
                }
              });
              
              console.log(`🔍 BROWSE MODE ERROR FALLBACK: Set pagination with ${validTotalCount} total items`);
            } catch (fallbackError) {
              console.error('Even fallback failed:', fallbackError);
              // Final fallback - minimal state
              set({
                agents: [],
                isLoading: false,
                pagination: {
                  ...pagination,
                  totalItems: 0,
                  totalPages: 1,
                  hasMore: false,
                  isLoadingMore: false
                }
              });
            }
          } else {
            // This is search mode - use original fallback logic
            if (allAgents.length > 0) {
              console.log('📦 Fallback: Using client-side filtering with existing data');
              
              // Initialize FreeSearchService if needed
              if (!freeSearchService.initialized) {
                freeSearchService.initialize(allAgents);
              }
              
              const searchResults = freeSearchService.searchAndFilter({
                searchQuery: searchQuery || '',
                category: selectedCategory,
                selectedFilter: selectedFilter,
                priceRange: selectedPrice,
                rating: selectedRating,
                tags: selectedTags,
                features: selectedFeatures,
                page: resetPagination ? 1 : pagination.currentPage,
                pageSize: pagination.pageSize
              });
              
              set({
                agents: searchResults.agents,
                isLoading: false,
                pagination: {
                  ...searchResults.pagination,
                  isLoadingMore: false
                }
              });
              
              console.log(`✅ Fallback: Client-side filtering completed - ${searchResults.agents.length}/${searchResults.total} agents`);
            } else {
              // No fallback data available
              set({
                agents: [], 
                isLoading: false,
                pagination: {
                  ...pagination,
                  hasMore: false,
                  lastVisibleId: null,
                  isLoadingMore: false,
                  totalItems: 0,
                  currentPage: 1,
                  totalPages: 1
                }
              });
            }
          }
        }
      },
      
      // Load initial data with Redis-First optimization
      loadInitialData: async (forceRefresh = false) => {
        const requestId = Date.now();
        currentLoadId = requestId;
        
        try {
          // Check cache validity
          const now = Date.now();
          const lastLoad = get().lastLoadTime;
          const cacheExpiry = get().cacheExpiry;
          
          if (!forceRefresh && lastLoad && (now - lastLoad < cacheExpiry) && get().allAgents.length > 0) {
            console.log('✅ Using cached agent data from', Math.round((now - lastLoad)/1000), 'seconds ago');
            set({ isLoading: false, isRecommendationsLoading: false });
            
            // Initialize FreeSearchService with cached data
            if (!freeSearchService.initialized) {
              freeSearchService.initialize(get().allAgents);
            }
            return;
          }
          
          set({ isLoading: true, isRecommendationsLoading: true });
          
          if (currentLoadId !== requestId) return;
          
          console.log('🚀 REDIS-FIRST: Loading initial data with optimized strategy');
          console.log('🔧 DEBUG: Current pageSize:', get().pagination.pageSize);
          
          // Load first page of agents with Redis-First backend
          const response = await fetchAgents('All', 'Hot & New', null, { 
            limit: get().pagination.pageSize,
            bypassCache: forceRefresh
          });
          
          if (currentLoadId !== requestId) return;
          
          // Extract response data
          const allAgentsResponse = response.agents || [];
          const fromCache = response.fromCache || false;
          const paginationData = response.pagination || {};
          const total = response.total || allAgentsResponse.length;
          
          console.log(`✅ REDIS-FIRST: Received ${allAgentsResponse.length} agents (fromCache: ${fromCache}, total: ${total})`);
          
          const fixedAgents = fixPlaceholderUrls(allAgentsResponse);
          
          // Derive featured and recommended agents efficiently
          const featuredAgents = fixedAgents
            .filter(agent => agent.isFeatured === true)
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, 8);
            
          const recommendedAgents = fixedAgents
            .sort((a, b) => {
              const aPopularity = a.usersCount || a.views || a.rating?.count || 0;
              const bPopularity = b.usersCount || b.views || b.rating?.count || 0;
              if (aPopularity !== bPopularity) return bPopularity - aPopularity;
              return (b.rating?.average || 0) - (a.rating?.average || 0);
            })
            .slice(0, 10);
            
          console.log(`📊 Derived ${featuredAgents.length} featured, ${recommendedAgents.length} recommended agents`);
          
          // Update store
          const currentPageSize = get().pagination.pageSize;
          set({ 
            agents: fixedAgents,
            allAgents: fixedAgents,
            featuredAgents: featuredAgents,
            recommendedAgents: recommendedAgents,
            isLoading: false,
            isRecommendationsLoading: false,
            lastLoadTime: Date.now(),
            pagination: {
              currentPage: 1,
              pageSize: currentPageSize,
              totalItems: total,
              totalPages: Math.ceil(total / currentPageSize),
              hasMore: paginationData.hasMore || false,
              lastVisibleId: paginationData.lastVisibleId || null,
              isLoadingMore: false
            }
          });
          
          // Initialize FreeSearchService for client-side filtering
          freeSearchService.initialize(fixedAgents);
          console.log('🔍 FreeSearchService initialized for optimal client-side filtering');
          
          // Compute statistics
          const tagCounter = {};
          const featureCounter = {};
          
          fixedAgents.forEach(agent => {
            agent.tags?.forEach(tag => {
                tagCounter[tag] = (tagCounter[tag] || 0) + 1;
              });
            agent.features?.forEach(feature => {
                featureCounter[feature] = (featureCounter[feature] || 0) + 1;
              });
          });
          
          set({ tagCounts: tagCounter, featureCounts: featureCounter });
          
          console.log('✅ REDIS-FIRST: Initial data loading completed successfully');
          
        } catch (error) {
          console.error('Error in loadInitialData:', error);
          set({ isLoading: false, isRecommendationsLoading: false });
        }
      },
      
      // Get featured agents from the store with proper filtering
      getFeaturedAgents: (limit = 8) => {
        const { allAgents } = get();
        
        if (!allAgents || allAgents.length === 0) {
          return [];
        }
        
        // Only include agents explicitly marked as featured
        return [...allAgents]
          .filter(agent => agent.isFeatured === true)
          .sort((a, b) => {
            // Sort by creation date - newest first
            const aDate = a.createdAt || a.dateCreated || a.updatedAt || '0';
            const bDate = b.createdAt || b.dateCreated || b.updatedAt || '0';
            return new Date(bDate) - new Date(aDate);
          })
          .slice(0, limit);
      },
      
      // Get recommended agents with appropriate filtering
      getRecommendedAgents: (limit = 4) => {
        const { allAgents, recommendedAgents } = get();
        
        // If we already have recommended agents, use those
        if (recommendedAgents && recommendedAgents.length > 0) {
          return recommendedAgents.slice(0, limit);
        }
        
        if (!allAgents || allAgents.length === 0) {
          return [];
        }
        
        // Create recommendations based on popularity or ratings
        return [...allAgents]
          .sort((a, b) => {
            // Sort by view count or popularity metrics
            const aPopularity = a.usersCount || a.views || a.rating?.count || 0;
            const bPopularity = b.usersCount || b.views || b.rating?.count || 0;
            
            if (aPopularity !== bPopularity) {
              return bPopularity - aPopularity; // Higher popularity first
            }
            
            // If popularity is the same, sort by rating
            const aRating = a.rating?.average || 0;
            const bRating = b.rating?.average || 0;
            return bRating - aRating;
          })
          .slice(0, limit);
      },

      // Load more agents using cursor-based pagination
      loadMore: async () => {
        const state = get();
        const { pagination, selectedCategory, selectedFilter, selectedPrice, selectedRating, selectedTags, selectedFeatures, searchQuery } = state;
        
        // Don't load if already loading or no more data
        if (pagination.isLoadingMore || !pagination.hasMore) {
          console.log('📋 LoadMore: Skipping - already loading or no more data', { isLoadingMore: pagination.isLoadingMore, hasMore: pagination.hasMore });
          return;
        }
        
        console.log('📋 LoadMore: Loading next page with lastVisibleId:', pagination.lastVisibleId);
        
        // Set loading state
        set({
          pagination: {
            ...pagination,
            isLoadingMore: true
          }
        });
        
        try {
          const isSearching = searchQuery?.trim();
          
          if (isSearching) {
            console.log('📋 LoadMore: Smart caching for search results');
            
            // For search results, check if we need more data
            const databaseTotal = await getSearchResultsCount(searchQuery);
            const currentCount = state.agents.length;
            
            console.log(`📋 LoadMore: Current ${currentCount}, Database total ${databaseTotal}`);
            
            if (currentCount >= databaseTotal) {
              console.log('📋 LoadMore: Already have all search results, no more to load');
              set({
                pagination: {
                  ...pagination,
                  hasMore: false,
                  isLoadingMore: false
                }
              });
              return;
            }
            
            // Fetch remaining results
            const remainingCount = databaseTotal - currentCount;
            const limitToUse = Math.min(remainingCount, 25); // Load in chunks of 25
            
            console.log(`📋 LoadMore: Fetching ${limitToUse} more search results`);
            
            const response = await fetchAgents('All', 'Most Popular', pagination.lastVisibleId, {
              limit: limitToUse,
              priceRange: { min: 0, max: 1000 },
              rating: undefined,
              tags: [],
              features: [],
              search: searchQuery
            });
            
            if (response && response.agents && response.agents.length > 0) {
              const newFixedAgents = fixPlaceholderUrls(response.agents);
              const updatedAgents = [...state.agents, ...newFixedAgents];
              
              console.log(`✅ LoadMore: Added ${newFixedAgents.length} more search results (${updatedAgents.length}/${databaseTotal} total)`);
              
              set({
                agents: updatedAgents,
                pagination: {
                  ...pagination,
                  currentPage: pagination.currentPage + 1,
                  hasMore: updatedAgents.length < databaseTotal,
                  lastVisibleId: response.pagination?.lastVisibleId || null,
                  isLoadingMore: false,
                  totalItems: databaseTotal
                }
              });
            } else {
              console.log('📋 LoadMore: No more search results available');
              set({
                pagination: {
                  ...pagination,
                  hasMore: false,
                  isLoadingMore: false
                }
              });
            }
            
            return;
          }
          
          // Regular browsing (non-search) - original logic
          console.log('📋 LoadMore: Regular browsing mode');
          
          // Call API with cursor-based pagination
          const response = await fetchAgents(selectedCategory, selectedFilter, pagination.lastVisibleId, {
            limit: pagination.pageSize,
            priceRange: selectedPrice,
            rating: selectedRating > 0 ? selectedRating : undefined,
            tags: selectedTags,
            features: selectedFeatures,
            search: undefined
          });
          
          if (response && response.agents && response.agents.length > 0) {
            // Fix placeholder URLs for new agents
            const newFixedAgents = fixPlaceholderUrls(response.agents);
            
            console.log(`✅ LoadMore: Received ${newFixedAgents.length} more agents (fromCache: ${response.fromCache})`);
            
            // Append new agents to existing ones
            const updatedAgents = [...state.agents, ...newFixedAgents];
            const updatedAllAgents = [...state.allAgents, ...newFixedAgents];
            
            // Update store with new data
            set({
              agents: updatedAgents,
              allAgents: updatedAllAgents,
              pagination: {
                ...pagination,
                currentPage: pagination.currentPage + 1,
                hasMore: response.pagination?.hasMore || false,
                lastVisibleId: response.pagination?.lastVisibleId || null,
                isLoadingMore: false,
                totalItems: response.total || state.pagination.totalItems
              }
            });
            
            // 🐛 DEBUG: Log loadMore pagination update
            console.log('🔍 DEBUG: LoadMore pagination update:', {
              newCurrentPage: pagination.currentPage + 1,
              newHasMore: response.pagination?.hasMore || false,
              newLastVisibleId: response.pagination?.lastVisibleId || null,
              totalAgentsNow: updatedAgents.length,
              totalItems: response.total || state.pagination.totalItems,
              responseTotal: response.total,
              responsePagination: response.pagination
            });
          } else {
            console.log('📋 LoadMore: No more agents received');
            set({
              pagination: {
                ...pagination,
                hasMore: false,
                isLoadingMore: false
              }
            });
          }
        } catch (error) {
          console.error('Error in loadMore:', error);
          set({
            pagination: {
              ...pagination,
              isLoadingMore: false
            }
          });
        }
      },

      // Pagination actions (kept for backward compatibility)
      setPage: (pageNumber) => {
        const state = get();
        const { pagination } = state;

        // Validate page number
        if (pageNumber === pagination.currentPage ||
            pageNumber < 1 ||
            pageNumber > pagination.totalPages) {
          return;
        }

        // Update pagination state
        set({
          pagination: {
            ...pagination,
            currentPage: pageNumber
          }
        });

        // Apply filters to get the correct page of data
        get().applyFilters();
      },

      setPageSize: (newSize) => {
        const state = get();
        const totalPages = Math.max(1, Math.ceil(state.pagination.totalItems / newSize));
        
        // Ensure current page is still valid
        const currentPage = Math.min(state.pagination.currentPage, totalPages);
        
        // Update pagination state
        set({
          pagination: {
            ...state.pagination,
            pageSize: newSize,
            currentPage: currentPage,
            totalPages: totalPages,
            lastVisibleId: null // Reset cursor when changing page size
          }
        });

        // Apply filters to get the correct page of data
        get().applyFilters();
      }
    }),
    { name: 'agent-store' }
  )
);

export default useAgentStore; 
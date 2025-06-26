import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { fetchAgents } from '../api/marketplace/agentApi'; //fetchWishlists
import { fixPlaceholderUrl } from '../utils/imageUtils';

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
        pageSize: 50,
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
      
      // Apply filters with cursor-based pagination
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
          pagination
        } = state;
        
        console.log('Applying filters with cursor-based pagination...');
        
        try {
          // Use cursor-based pagination API
          const lastVisibleId = resetPagination ? null : pagination.lastVisibleId;
          
          const response = await fetchAgents(
            selectedCategory,
            selectedFilter,
            lastVisibleId,
            {
              limit: pagination.pageSize,
              priceRange: selectedPrice,
              rating: selectedRating,
              tags: selectedTags,
              features: selectedFeatures,
              search: searchQuery
            }
          );
          
          if (!response || !response.agents) {
            console.warn('No data returned from fetchAgents');
            set({ 
              agents: [], 
              isLoading: false,
              pagination: {
                ...pagination,
                hasMore: false,
                lastVisibleId: null,
                isLoadingMore: false
              }
            });
            return;
          }
          
          // Fix placeholder URLs for the filtered agents
          const fixedAgents = fixPlaceholderUrls(response.agents);
          
          console.log(`Applied filters - found ${fixedAgents.length} agents, hasMore: ${response.pagination.hasMore}`);

          // Update state with filtered agents and new pagination info
          set({
            agents: resetPagination ? fixedAgents : [...state.agents, ...fixedAgents], // Append if loading more
            pagination: {
              ...pagination,
              totalItems: response.total,
              totalPages: response.pagination.totalPages || 1,
              currentPage: response.pagination.currentPage || 1,
              hasMore: response.pagination.hasMore,
              lastVisibleId: response.pagination.lastVisibleId,
              isLoadingMore: false
            }
          });
        } catch (error) {
          console.error('Error applying filters:', error);
          
          // Fallback to client-side filtering if API fails
          console.log('Falling back to client-side filtering...');
          const { allAgents } = state;
          
          let filtered = [...allAgents];
          
          // Apply category filter
          if (selectedCategory && selectedCategory !== 'All') {
            filtered = filtered.filter(agent => 
              agent.category === selectedCategory ||
              (agent.categories && agent.categories.includes(selectedCategory))
            );
          }
          
          // Apply search filter
          if (searchQuery && searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(agent => 
              agent.title?.toLowerCase().includes(query) ||
              agent.name?.toLowerCase().includes(query) ||
              agent.description?.toLowerCase().includes(query) ||
              agent.tags?.some(tag => tag.toLowerCase().includes(query)) ||
              agent.features?.some(feature => feature.toLowerCase().includes(query)) ||
              agent.creator?.name?.toLowerCase().includes(query)
            );
          }
          
          // Apply price range filter
          if (selectedPrice.min > 0 || selectedPrice.max < 1000) {
            filtered = filtered.filter(agent => {
              let price = 0;
              if (agent.priceDetails?.basePrice !== undefined) {
                price = agent.priceDetails.discountedPrice || agent.priceDetails.basePrice;
              } else if (typeof agent.price === 'number') {
                price = agent.price;
              } else if (typeof agent.price === 'string') {
                price = parseFloat(agent.price.replace(/[^0-9.]/g, '')) || 0;
              }
              return price >= selectedPrice.min && price <= selectedPrice.max;
            });
          }
          
          // Apply rating filter
          if (selectedRating > 0) {
            filtered = filtered.filter(agent => {
              const rating = agent.rating?.average || 0;
              return rating >= selectedRating;
            });
          }
          
          // Apply tag filters
          if (selectedTags.length > 0) {
            filtered = filtered.filter(agent => 
              agent.tags && selectedTags.some(tag => agent.tags.includes(tag))
            );
          }
          
          // Apply feature filters
          if (selectedFeatures.length > 0) {
            filtered = filtered.filter(agent => 
              agent.features && selectedFeatures.some(feature => agent.features.includes(feature))
            );
          }
          
          // Apply sorting
          switch (selectedFilter) {
            case 'Top Rated':
              filtered.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
              break;
            case 'Most Popular':
              filtered.sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
              break;
            case 'Price: Low to High':
              filtered.sort((a, b) => {
                const aPrice = a.priceDetails?.basePrice || a.price || 0;
                const bPrice = b.priceDetails?.basePrice || b.price || 0;
                return aPrice - bPrice;
              });
              break;
            case 'Price: High to Low':
              filtered.sort((a, b) => {
                const aPrice = a.priceDetails?.basePrice || a.price || 0;
                const bPrice = b.priceDetails?.basePrice || b.price || 0;
                return bPrice - aPrice;
              });
              break;
            default: // 'Hot & New'
              filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
              break;
          }
          
          // Calculate pagination information
          const totalItems = filtered.length;
          const { pageSize } = pagination;
          const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
          const currentPage = Math.min(pagination.currentPage, totalPages);
          
          // Apply pagination
          const startIndex = (currentPage - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          const paginatedAgents = filtered.slice(startIndex, endIndex);
          
          // Update state with filtered and paginated results
          set({
            agents: paginatedAgents,
            pagination: {
              ...pagination,
              currentPage: currentPage,
              totalItems: totalItems,
              totalPages: totalPages,
              hasMore: endIndex < totalItems,
              isLoadingMore: false
            }
          });
          
          console.log(`Applied filters (fallback): ${totalItems} total, showing page ${currentPage}/${totalPages} (${paginatedAgents.length} items)`);
        }
      },
      
      // Load initial data
      loadInitialData: async (forceRefresh = false) => {
        // Generate a unique ID for this request
        const requestId = Date.now();
        currentLoadId = requestId;
        
        try {
          // Check if we have recent data in cache
          const now = Date.now();
          const lastLoad = get().lastLoadTime;
          const cacheExpiry = get().cacheExpiry;
          
          // Skip cache if forceRefresh is true
          if (!forceRefresh && lastLoad && (now - lastLoad < cacheExpiry) && get().allAgents.length > 0) {
            console.log('Using cached agent data from', Math.round((now - lastLoad)/1000), 'seconds ago');
            // If we have cached data, just update loading states
            set({ isLoading: false, isRecommendationsLoading: false });
            return;
          }
          
          // Set loading state
          set({ isLoading: true, isRecommendationsLoading: true });
          
          // If the ID changes during fetch, abort operation
          if (currentLoadId !== requestId) {
            console.log('Aborting superseded loadInitialData request');
            return;
          }
          
          // MAKE ONLY ONE API CALL - Get all agents with a larger limit to ensure we have enough data
          console.log('Fetching fresh agent data with a single API call');
          
          // Avoid duplicate calls with a short timeout
          await new Promise(resolve => setTimeout(resolve, 10));
          
          // Check again if this request is still relevant
          if (currentLoadId !== requestId) {
            console.log('Aborting superseded loadInitialData request after timeout');
            return;
          }
          
          // Use a larger limit to ensure we have enough agents for all purposes
          // We need to make sure we get enough for:
          // 1. All standard filtering
          // 2. Featured agents
          // 3. Recommended agents
          const response = await fetchAgents('All', 'All', null, { 
            limit: 100, // Higher limit to get enough data for all needs
            bypassCache: forceRefresh, // Only bypass cache if forceRefresh is true
            useMockData: process.env.NODE_ENV === 'development' // Use mock data in development if needed
          });
          
          const allAgentsResponse = response.agents || response;
          
          // Check if this request is still relevant
          if (currentLoadId !== requestId) {
            console.log('Ignoring stale agent data response');
            return;
          }
          
          // Fetch wishlists separately (this is essential user data, not redundant)
          // Only fetch wishlists if we have an authenticated user or force refresh is true
          // let wishlistsResponse = [];
          // if (localStorage.getItem('authToken') || forceRefresh) {
          //   try {
          //     wishlistsResponse = await fetchWishlists();
          //   } catch (error) {
          //     console.error('Error fetching wishlists, using empty array:', error);
          //     wishlistsResponse = [];
          //   }
          // } else {
          //   console.log('Skipping wishlist fetch for unauthenticated user');
          // }
          
          // Check again if this request is still relevant
          if (currentLoadId !== requestId) {
            console.log('Ignoring stale wishlist data response');
            return;
          }
          
          // Apply URL fixes to ensure placeholders work
          const fixedAgents = fixPlaceholderUrls(allAgentsResponse) || [];
          
          // DERIVE FEATURED AGENTS - No separate API call
          const featuredAgents = [...fixedAgents]
            .filter(agent => agent.isFeatured === true) // Only include agents explicitly marked as featured
            .sort((a, b) => {
              // Sort by creation date - newest first
              const aDate = a.createdAt || a.dateCreated || a.updatedAt || '0';
              const bDate = b.createdAt || b.dateCreated || b.updatedAt || '0';
              return new Date(bDate) - new Date(aDate);
            })
            .slice(0, 8); // Limit to 8 featured agents
            
          console.log(`Derived ${featuredAgents.length} featured agents locally from all agents data`);
          
          // DERIVE RECOMMENDED AGENTS - No separate API call
          const recommendedAgents = [...fixedAgents]
            .sort((a, b) => {
              const aPopularity = a.usersCount || a.views || a.rating?.count || 0;
              const bPopularity = b.usersCount || b.views || b.rating?.count || 0;
              
              if (aPopularity !== bPopularity) {
                return bPopularity - aPopularity;
              }
              
              const aRating = a.rating?.average || 0;
              const bRating = b.rating?.average || 0;
              return bRating - aRating;
            })
            .slice(0, 10);
            
          console.log(`Derived ${recommendedAgents.length} recommended agents locally from all agents data`);
          
          // Update store with ALL data at once
          set({ 
            agents: fixedAgents,
            allAgents: fixedAgents,
            featuredAgents: featuredAgents,
            recommendedAgents: recommendedAgents,
            // wishlists: wishlistsResponse,
            isLoading: false,
            isRecommendationsLoading: false,
            lastLoadTime: Date.now() // Update the cache timestamp
          });
          
          // Compute tag and feature statistics
          const tagCounter = {};
          const featureCounter = {};
          
          fixedAgents.forEach(agent => {
            // Count tags
            if (agent.tags && Array.isArray(agent.tags)) {
              agent.tags.forEach(tag => {
                tagCounter[tag] = (tagCounter[tag] || 0) + 1;
              });
            }
            
            // Count features
            if (agent.features && Array.isArray(agent.features)) {
              agent.features.forEach(feature => {
                featureCounter[feature] = (featureCounter[feature] || 0) + 1;
              });
            }
          });
          
          set({ 
            tagCounts: tagCounter, 
            featureCounts: featureCounter
          });
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
        const { pagination } = state;
        
        // Don't load if already loading or no more data
        if (pagination.isLoadingMore || !pagination.hasMore) {
          return;
        }
        
        // Set loading state
        set({
          pagination: {
            ...pagination,
            isLoadingMore: true
          }
        });
        
        // Load more data without resetting pagination
        await get().applyFilters(false);
      },

      // Reset pagination and filters
      resetFilters: () => {
        set({
          selectedCategory: 'All',
          selectedFilter: 'Hot & New',
          selectedPrice: { min: 0, max: 1000 },
          selectedRating: 0,
          selectedTags: [],
          selectedFeatures: [],
          searchQuery: '',
          pagination: {
            currentPage: 1,
            pageSize: 50,
            totalItems: 0,
            totalPages: 1,
            hasMore: false,
            lastVisibleId: null,
            isLoadingMore: false
          }
        });
        
        // Apply filters to reload data
        get().applyFilters();
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
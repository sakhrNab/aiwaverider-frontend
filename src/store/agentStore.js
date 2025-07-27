// src/store/agentStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { fetchAgents, getAgentsCount } from '../api/marketplace/agentApi'; //fetchWishlists
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
      allAgents: [], // Add missing allAgents property
      featuredAgents: [],
      recommendedAgents: [],
      selectedCategory: 'All',
      selectedFilter: 'Hot & New',
      selectedPrice: { min: 0, max: 1000 },
      selectedRating: 0,
      selectedTags: [],
      selectedFeatures: [],
      searchQuery: '',
      isLoading: true,
      isStoreLoading: true, // Add missing isStoreLoading property
      isRecommendationsLoading: true,
      tagCounts: {},
      featureCounts: {},
      lastLoadTime: null,
      cacheExpiry: 5 * 60 * 1000, // Reduced to 5 minutes to avoid stale data
      
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
      setFeaturedAgents: (featuredAgents) => set({ featuredAgents }),
      setRecommendedAgents: (recommendedAgents) => set({ recommendedAgents }),
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
      
      // Apply filters and search with NEW backend architecture
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
        
        console.log('🔍 ApplyFilters: Starting with NEW backend architecture');
        console.log('🔍 Parameters:', {
          category: selectedCategory,
          filter: selectedFilter,
          search: searchQuery,
          priceRange: selectedPrice,
          rating: selectedRating,
          tags: selectedTags,
          features: selectedFeatures,
          resetPagination
        });
        
        try {
          set({ isLoading: true });
          
          const lastVisibleId = resetPagination ? null : pagination.lastVisibleId;
          
          // 🔧 NEW BACKEND ARCHITECTURE: Send proper parameters
          const apiParams = {
            // Core parameters
            searchQuery: searchQuery?.trim() || undefined, // Use searchQuery instead of search
            category: selectedCategory,
            filter: selectedFilter,
            limit: pagination.pageSize,
            offset: resetPagination ? 0 : (pagination.currentPage - 1) * pagination.pageSize,
            
            // Filter parameters - now sent as individual parameters
            priceMin: selectedPrice?.min > 0 ? selectedPrice.min : undefined,
            priceMax: selectedPrice?.max < 1000 ? selectedPrice.max : undefined,
            rating: selectedRating > 0 ? selectedRating : undefined,
            tags: selectedTags?.length > 0 ? selectedTags.join(',') : undefined,
            features: selectedFeatures?.length > 0 ? selectedFeatures.join(',') : undefined,
            
            // Additional parameters
            lastVisibleId: lastVisibleId,
            bypassCache: false
          };
          
          console.log('🔍 NEW Backend API Parameters:', apiParams);
          
          // Call the updated fetchAgents function with new parameters
          const response = await fetchAgents(apiParams);
          
          console.log('🔍 NEW Backend API Response:', {
            agentsCount: response?.agents?.length || 0,
            fromCache: response?.fromCache,
            total: response?.totalCount,
            hasMore: response?.hasMore,
            mode: response?.mode
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
          
          console.log(`✅ Received ${fixedAgents.length} agents (fromCache: ${response.fromCache})`);

          // Update state with new agents and pagination info
          set({
            agents: resetPagination ? fixedAgents : [...state.agents, ...fixedAgents],
            isLoading: false,
            pagination: {
              currentPage: resetPagination ? 1 : pagination.currentPage + 1,
              pageSize: pagination.pageSize,
              totalItems: response.totalCount || fixedAgents.length,
              totalPages: Math.ceil((response.totalCount || fixedAgents.length) / pagination.pageSize),
              hasMore: response.hasMore || false,
              lastVisibleId: response.lastVisibleId || null,
              isLoadingMore: false
            }
          });
          
          console.log('✅ Store updated successfully with NEW backend architecture');
          
        } catch (error) {
          console.error('Error in applyFilters:', error);
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
      },
      
      // Load initial data with simplified caching
      loadInitialData: async (forceRefresh = false) => {
        const requestId = Date.now();
        currentLoadId = requestId;
        
        try {
          // Simple cache validity check
          const now = Date.now();
          const lastLoad = get().lastLoadTime;
          const cacheExpiry = get().cacheExpiry;
          
          if (!forceRefresh && lastLoad && (now - lastLoad < cacheExpiry) && get().agents.length > 0) {
            console.log('✅ Using cached agent data from', Math.round((now - lastLoad)/1000), 'seconds ago');
            set({ isLoading: false, isStoreLoading: false, isRecommendationsLoading: false });
            return;
          }
          
          set({ isLoading: true, isStoreLoading: true, isRecommendationsLoading: true });
          
          if (currentLoadId !== requestId) return;
          
          console.log('🚀 Loading initial data with NEW backend architecture');
          
          // Load first page of agents using new parameters
          const apiParams = {
            category: 'All',
            filter: 'Hot & New',
            limit: get().pagination.pageSize,
            offset: 0,
            bypassCache: forceRefresh
          };
          
          const response = await fetchAgents(apiParams);
          
          if (currentLoadId !== requestId) return;
          
          // Extract response data
          const agentsResponse = response.agents || [];
          const fromCache = response.fromCache || false;
          const total = response.totalCount || agentsResponse.length;
          
          console.log(`✅ Received ${agentsResponse.length} agents (fromCache: ${fromCache}, total: ${total})`);
          
          const fixedAgents = fixPlaceholderUrls(agentsResponse);
          
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
            allAgents: fixedAgents, // Set allAgents to the same as agents for now
            featuredAgents: featuredAgents,
            recommendedAgents: recommendedAgents,
            isLoading: false,
            isStoreLoading: false, // Set isStoreLoading to false when data is loaded
            isRecommendationsLoading: false,
            lastLoadTime: Date.now(),
            pagination: {
              currentPage: 1,
              pageSize: currentPageSize,
              totalItems: total,
              totalPages: Math.ceil(total / currentPageSize),
              hasMore: response.hasMore || false,
              lastVisibleId: response.lastVisibleId || null,
              isLoadingMore: false
            }
          });
          
          // Compute statistics for sidebar filters
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
          
          console.log('✅ Initial data loading completed successfully');
          
        } catch (error) {
          console.error('Error in loadInitialData:', error);
          set({ isLoading: false, isStoreLoading: false, isRecommendationsLoading: false });
        }
      },
      
      // Get featured agents from the store
      getFeaturedAgents: (limit = 8) => {
        const { featuredAgents } = get();
        return featuredAgents.slice(0, limit);
      },
      
      // Get recommended agents 
      getRecommendedAgents: (limit = 4) => {
        const { recommendedAgents } = get();
        return recommendedAgents.slice(0, limit);
      },

      // Load more agents using cursor-based pagination - RENAMED to match component usage
      loadMoreAgents: async () => {
        const state = get();
        const { pagination, selectedCategory, selectedFilter, selectedPrice, selectedRating, selectedTags, selectedFeatures, searchQuery } = state;
        
        // Don't load if already loading or no more data
        if (pagination.isLoadingMore || !pagination.hasMore) {
          console.log('📋 LoadMoreAgents: Skipping - already loading or no more data', { isLoadingMore: pagination.isLoadingMore, hasMore: pagination.hasMore });
          return;
        }
        
        console.log('📋 LoadMoreAgents: Loading next page with lastVisibleId:', pagination.lastVisibleId);
        
        // Set loading state
        set({
          pagination: {
            ...pagination,
            isLoadingMore: true
          }
        });
        
        try {
          // Call API with cursor-based pagination using same parameters as applyFilters
          const apiParams = {
            searchQuery: searchQuery?.trim() || undefined,
            category: selectedCategory,
            filter: selectedFilter,
            limit: pagination.pageSize,
            offset: pagination.currentPage * pagination.pageSize, // Calculate offset from current page
            priceMin: selectedPrice?.min > 0 ? selectedPrice.min : undefined,
            priceMax: selectedPrice?.max < 1000 ? selectedPrice.max : undefined,
            rating: selectedRating > 0 ? selectedRating : undefined,
            tags: selectedTags?.length > 0 ? selectedTags.join(',') : undefined,
            features: selectedFeatures?.length > 0 ? selectedFeatures.join(',') : undefined,
            lastVisibleId: pagination.lastVisibleId
          };
          
          const response = await fetchAgents(apiParams);
          
          if (response && response.agents && response.agents.length > 0) {
            // Fix placeholder URLs for new agents
            const newFixedAgents = fixPlaceholderUrls(response.agents);
            
            console.log(`✅ LoadMoreAgents: Received ${newFixedAgents.length} more agents (fromCache: ${response.fromCache})`);
            
            // Append new agents to existing ones
            const updatedAgents = [...state.agents, ...newFixedAgents];
            
            // Update store with new data
            set({
              agents: updatedAgents,
              pagination: {
                ...pagination,
                currentPage: pagination.currentPage + 1,
                hasMore: response.hasMore || false,
                lastVisibleId: response.lastVisibleId || null,
                isLoadingMore: false,
                totalItems: response.totalCount || state.pagination.totalItems
              }
            });
            
            console.log('🔍 LoadMoreAgents pagination update:', {
              newCurrentPage: pagination.currentPage + 1,
              newHasMore: response.hasMore || false,
              newLastVisibleId: response.lastVisibleId || null,
              totalAgentsNow: updatedAgents.length,
              totalItems: response.totalCount || state.pagination.totalItems
            });
          } else {
            console.log('📋 LoadMoreAgents: No more agents received');
            set({
              pagination: {
                ...pagination,
                hasMore: false,
                isLoadingMore: false
              }
            });
          }
        } catch (error) {
          console.error('Error in loadMoreAgents:', error);
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
      },

      // Set all agents (for individual agent updates)
      setAllAgents: (agents) => {
        console.log('Setting allAgents in store:', agents?.length || 0);
        set({ allAgents: agents || [] });
      }
    }),
    { name: 'agent-store' }
  )
);

export default useAgentStore;
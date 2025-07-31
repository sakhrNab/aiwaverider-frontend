// Free Search Service using Fuse.js for client-side search
// This replaces expensive Firebase queries with fast, free client-side search

import Fuse from 'fuse.js';

/**
 * Free Search Service using Fuse.js
 * Provides client-side search and filtering with zero Firebase costs
 * 
 * Features:
 * - Fuzzy search with typo tolerance
 * - Multi-field search (name, description, tags, creator)
 * - Advanced filtering (category, price, rating)
 * - Multiple sorting options
 * - Sub-50ms response times
 * - Works offline
 */

class FreeSearchService {
  constructor() {
    this.fuse = null;
    this.agents = [];
    this.initialized = false;
    
    // Fuse.js configuration for optimal search
    this.fuseOptions = {
      // Search configuration
      threshold: 0.4, // 0.0 = perfect match, 1.0 = match anything
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 2,
      
      // Fields to search with weights
      keys: [
        { name: 'name', weight: 0.3 },
        { name: 'description', weight: 0.2 },
        { name: 'tags', weight: 0.2 },
        { name: 'creator.name', weight: 0.1 },
        { name: 'creator.username', weight: 0.1 },
        { name: 'category', weight: 0.1 }
      ],
      
      // Include score and matched indices
      includeScore: true,
      includeMatches: true
    };
  }
  
  /**
   * Initialize the search service with agent data
   * @param {Array} agentsData - Array of agent objects
   */
  initialize(agentsData) {
    if (!agentsData || !Array.isArray(agentsData)) {
      console.warn('FreeSearchService: Invalid agent data provided');
      return;
    }
    
    console.log(`🔍 FreeSearchService: Initializing with ${agentsData.length} agents`);
    
    this.agents = agentsData.map(agent => ({
      ...agent,
      // Ensure searchable fields exist
      searchableText: this.createSearchableText(agent),
      // Normalize price for filtering
      normalizedPrice: this.normalizePrice(agent.price || agent.pricing)
    }));
    
    // Create Fuse.js instance
    this.fuse = new Fuse(this.agents, this.fuseOptions);
    this.initialized = true;
    
    console.log(`✅ FreeSearchService: Initialized successfully`);
  }
  
  /**
   * Search and filter agents with comprehensive options
   * @param {Object} options - Search and filter options
   * @returns {Object} - Search results with pagination
   */
  searchAndFilter(options = {}) {
    const startTime = performance.now();
    
    if (!this.initialized) {
      console.warn('FreeSearchService: Not initialized');
      return this.createEmptyResult();
    }
    
    const {
      searchQuery = '',
      category = 'All',
      selectedFilter = 'Hot & New',
      priceRange = { min: 0, max: 1000 },
      rating = 0,
      tags = [],
      features = [],
      page = 1,
      pageSize = 50
    } = options;
    
    console.log(`🔍 FreeSearchService: Searching with query: "${searchQuery}"`);
    
    let results = this.agents;
    
    // 1. SEARCH: Apply text search if query exists
    if (searchQuery && searchQuery.trim()) {
      const fuseResults = this.fuse.search(searchQuery.trim());
      results = fuseResults.map(result => ({
        ...result.item,
        searchScore: result.score,
        searchMatches: result.matches
      }));
      console.log(`📝 Search results: ${results.length} agents found for "${searchQuery}"`);
    }
    
    // 2. CATEGORY FILTER: Filter by category
    if (category && category !== 'All') {
      results = results.filter(agent => 
        agent.category && agent.category.toLowerCase() === category.toLowerCase()
      );
      console.log(`🏷️ Category filter: ${results.length} agents in "${category}"`);
    }
    
    // 3. PRICE FILTER: Filter by price range
    if (priceRange && (priceRange.min > 0 || priceRange.max < 1000)) {
      results = results.filter(agent => {
        const agentPrice = agent.normalizedPrice;
        return agentPrice >= priceRange.min && agentPrice <= priceRange.max;
      });
      console.log(`💰 Price filter: ${results.length} agents in range $${priceRange.min}-$${priceRange.max}`);
    }
    
    // 4. RATING FILTER: Filter by minimum rating
    if (rating > 0) {
      results = results.filter(agent => {
        const agentRating = agent.rating?.average || 0;
        return agentRating >= rating;
      });
      console.log(`⭐ Rating filter: ${results.length} agents with rating >= ${rating}`);
    }
    
    // 5. TAGS FILTER: Filter by selected tags
    if (tags && tags.length > 0) {
      results = results.filter(agent => {
        const agentTags = agent.tags || [];
        return tags.some(tag => agentTags.includes(tag));
      });
      console.log(`🏷️ Tags filter: ${results.length} agents with tags [${tags.join(', ')}]`);
    }
    
    // 6. FEATURES FILTER: Filter by selected features
    if (features && features.length > 0) {
      results = results.filter(agent => {
        const agentFeatures = agent.features || [];
        return features.some(feature => agentFeatures.includes(feature));
      });
      console.log(`🔧 Features filter: ${results.length} agents with features [${features.join(', ')}]`);
    }
    
    // 7. SORTING: Apply selected sort filter
    results = this.applySorting(results, selectedFilter);
    
    // 8. PAGINATION: Apply pagination
    const totalResults = results.length;
    const totalPages = Math.ceil(totalResults / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResults = results.slice(startIndex, endIndex);
    
    const endTime = performance.now();
    const searchTime = Math.round(endTime - startTime);
    
    console.log(`✅ FreeSearchService: Completed in ${searchTime}ms - ${paginatedResults.length}/${totalResults} agents (page ${page}/${totalPages})`);
    
    return {
      agents: paginatedResults,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalItems: totalResults,
        totalPages: totalPages,
        hasMore: page < totalPages,
        lastVisibleId: null, // Not used in client-side pagination
        isLoadingMore: false
      },
      total: totalResults,
      searchTime: searchTime,
      fromCache: false, // Client-side is always "fresh"
      mode: 'client-side'
    };
  }
  
  /**
   * Create searchable text from agent data
   * @param {Object} agent - Agent object
   * @returns {string} - Searchable text
   */
  createSearchableText(agent) {
    const parts = [
      agent.name || '',
      agent.description || '',
      agent.category || '',
      agent.creator?.name || '',
      agent.creator?.username || '',
      ...(agent.tags || []),
      ...(agent.features || [])
    ];
    
    return parts.join(' ').toLowerCase();
  }
  
  /**
   * Normalize price for consistent filtering
   * @param {*} price - Price value (string, number, or object)
   * @returns {number} - Normalized price
   */
  normalizePrice(price) {
    if (!price) return 0;
    
    // Handle different price formats
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      const numPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
      return isNaN(numPrice) ? 0 : numPrice;
    }
    if (typeof price === 'object') {
      return price.amount || price.value || price.price || 0;
    }
    
    return 0;
  }
  
  /**
   * Apply sorting to results
   * @param {Array} results - Array of agents
   * @param {string} sortFilter - Sort filter
   * @returns {Array} - Sorted array
   */
  applySorting(results, sortFilter) {
    console.log(`🔄 Applying sort: ${sortFilter}`);
    
    switch (sortFilter) {
      case 'Top Rated':
        return results.sort((a, b) => {
          const aRating = a.rating?.average || 0;
          const bRating = b.rating?.average || 0;
          if (aRating !== bRating) return bRating - aRating;
          
          // Secondary sort by rating count
          const aCount = a.rating?.count || 0;
          const bCount = b.rating?.count || 0;
          return bCount - aCount;
        });
        
      case 'Most Popular':
        return results.sort((a, b) => {
          const aPopularity = a.usersCount || a.views || a.downloads || 0;
          const bPopularity = b.usersCount || b.views || b.downloads || 0;
          if (aPopularity !== bPopularity) return bPopularity - aPopularity;
          
          // Secondary sort by rating
          const aRating = a.rating?.average || 0;
          const bRating = b.rating?.average || 0;
          return bRating - aRating;
        });
        
      case 'Price: Low to High':
        return results.sort((a, b) => {
          const aPrice = a.normalizedPrice;
          const bPrice = b.normalizedPrice;
          return aPrice - bPrice;
        });
        
      case 'Price: High to Low':
        return results.sort((a, b) => {
          const aPrice = a.normalizedPrice;
          const bPrice = b.normalizedPrice;
          return bPrice - aPrice;
        });
        
      case 'Hot & New':
      default:
        return results.sort((a, b) => {
          const aDate = new Date(a.createdAt || a.dateCreated || 0);
          const bDate = new Date(b.createdAt || b.dateCreated || 0);
          return bDate - aDate;
        });
    }
  }
  
  /**
   * Create empty result structure
   * @returns {Object} - Empty result object
   */
  createEmptyResult() {
    return {
      agents: [],
      pagination: {
        currentPage: 1,
        pageSize: 50,
        totalItems: 0,
        totalPages: 0,
        hasMore: false,
        lastVisibleId: null,
        isLoadingMore: false
      },
      total: 0,
      searchTime: 0,
      fromCache: false,
      mode: 'client-side'
    };
  }
  
  /**
   * Get all available categories from agents
   * @returns {Array} - Array of category names
   */
  getCategories() {
    if (!this.initialized) return [];
    
    const categories = new Set();
    this.agents.forEach(agent => {
      if (agent.category) {
        categories.add(agent.category);
      }
    });
    
    return Array.from(categories).sort();
  }
  
  /**
   * Get all available tags with counts
   * @returns {Object} - Object with tag counts
   */
  getTagCounts() {
    if (!this.initialized) return {};
    
    const tagCounts = {};
    this.agents.forEach(agent => {
      if (agent.tags && Array.isArray(agent.tags)) {
        agent.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    return tagCounts;
  }
  
  /**
   * Get all available features with counts
   * @returns {Object} - Object with feature counts
   */
  getFeatureCounts() {
    if (!this.initialized) return {};
    
    const featureCounts = {};
    this.agents.forEach(agent => {
      if (agent.features && Array.isArray(agent.features)) {
        agent.features.forEach(feature => {
          featureCounts[feature] = (featureCounts[feature] || 0) + 1;
        });
      }
    });
    
    return featureCounts;
  }
}

// Create singleton instance
const freeSearchService = new FreeSearchService();

export default freeSearchService; 
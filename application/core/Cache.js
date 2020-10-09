/**
 * @class Cache
 * @description temporarily stores the data for quick access
 * @author E. Bright
 * @copyright Nugress GK
 * @license MIT
 * @version 1.8.0
 * @requires node-cache
 */

const NodeCache = require("node-cache");

class Cache {
  cache = null;
  start() {
    this.cache = new NodeCache(); // node cache
    console.log(`cache service started`);
  }
  async getCacheData(key) {
    return await this.cache.get(key);
  }

  async setCacheData(key, data, ttl) {
    return await this.cache.set(key, data, ttl);
  }

  async setMultiCacheData(data = []) {
    return await this.cache.mset(data);
  }

  async hasKey(key) {
    return await this.cache.has(key);
  }

  async takeCacheData(key) {
    return await this.cache.take(key);
  }

  async deleteCacheKey(key) {
    return await this.cache.del(key);
  }

  async changeTTL(key, newTTL) {
    return this.cache.ttl(key, newTTL);
  }

  async getCacheStats() {
    return await this.cache.getStats();
  }
}

module.exports = new Cache();

// OrganizeIT Platform Data Management Utility
// This initializes the platform with real enterprise data from Supabase

import { initAPI, healthAPI } from './utils/api'

export const checkBackendHealth = async () => {
  try {
    const response = await healthAPI.checkHealth()
    if (response?.status === 'healthy') {
      console.log('✓ Backend healthy:', response.service)
      return true
    }
    return false
  } catch (error) {
    console.error('Backend health check failed:', error)
    return false
  }
}

export const initializeBackendData = async () => {
  try {
    console.log('Checking if data is initialized...')
    
    // Check if data is already initialized
    const statusResponse = await initAPI.checkInitialized()
    
    if (statusResponse.initialized) {
      console.log('✓ Data already initialized:', {
        timestamp: statusResponse.timestamp,
        version: statusResponse.version
      })
      return true
    }
    
    // Initialize data if not already done
    console.log('Initializing platform data...')
    const initResponse = await initAPI.initializeData()
    
    if (initResponse.success) {
      console.log('✓ Data initialized successfully:', initResponse.counts)
      return true
    }
    
    return false
  } catch (error) {
    console.error('Data initialization failed:', error)
    return false
  }
}

export const initializeData = async () => {
  try {
    const isBackendAvailable = await checkBackendHealth()
    
    if (!isBackendAvailable) {
      console.error('❌ Backend not available. Please check your Supabase configuration.')
      return false
    }
    
    console.log('🚀 OrganizeIT Platform - Connecting to Supabase Backend')
    
    const dataInitialized = await initializeBackendData()
    
    if (dataInitialized) {
      console.log('✓ Platform ready with real-time data from Supabase')
      console.log('💡 All features connected to live backend - no mock data')
      return true
    } else {
      console.error('❌ Failed to initialize platform data')
      return false
    }
  } catch (error) {
    console.error('Initialization error:', error)
    return false
  }
}
// Interfaces for GA4 Events
export interface GTMEventItem {
  item_name: string
  item_id: string | number
  price: number
  item_brand?: string
  item_category?: string
  item_variant?: string
  item_size?: string
  quantity?: number // For cart-related events
}

// Base interface for all GTM events
interface BaseGTMEvent {
  event: string
  dzns_id?: string
  ecommerce: {
    items: GTMEventItem[]
  }
}

export interface GTMViewItemEvent extends BaseGTMEvent {
  event: 'view_item'
}

export interface GTMSelectItemEvent extends BaseGTMEvent {
  event: 'select_item'
}

export interface GTMAddToCartEvent extends BaseGTMEvent {
  event: 'add_to_cart'
}

export interface GTMViewCartEvent extends BaseGTMEvent {
  event: 'view_cart'
}

export interface GTMRemoveFromCartEvent extends BaseGTMEvent {
  event: 'remove_from_cart'
}

export interface GTMReduceItemQuantityEvent extends BaseGTMEvent {
  event: 'reduce_item_quantity'
}

export interface GTMViewItemListEvent extends BaseGTMEvent {
  event: 'view_item_list'
  item_list_id?: string
  item_list_name?: string
}

// Function to push event data to GTM's dataLayer
export const pushToDataLayer = (
  eventData:
    | GTMViewItemEvent
    | GTMSelectItemEvent
    | GTMAddToCartEvent
    | GTMViewCartEvent
    | GTMRemoveFromCartEvent
    | GTMViewItemListEvent,
) => {
  // Clean up the event data by removing any user agent related parameters
  const cleanEventData = { ...eventData }

  // Remove any user agent related properties that might be automatically added
  const userAgentProperties = [
    '_user_agent_architecture',
    '_user_agent_bitness',
    '_user_agent_full_version_list',
    '_user_agent_mobile',
    '_user_agent_model',
    '_user_agent_platform',
    '_user_agent_platform_version',
    '_user_agent_wow64',
    '_protected_audience_enabled',
  ]

  userAgentProperties.forEach((prop) => {
    if (cleanEventData[prop as keyof typeof cleanEventData]) {
      delete cleanEventData[prop as keyof typeof cleanEventData]
    }
  })

  // Push the cleaned event data
  window?.dataLayer?.push(cleanEventData)
  // Clear the ecommerce object to prevent merging issues
  window?.dataLayer?.push({
    ecommerce: null, // Clear any previous ecommerce data
    dzns_id: null,
  })
}

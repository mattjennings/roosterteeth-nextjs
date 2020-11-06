declare namespace RT {
  export interface SearchResponse<T> {
    data: T[]
    page: number
    per_page: number
    total_pages: number
    total_results: number
  }

  export interface Episode {
    _index: string
    _type: string
    _id: string
    _score?: any
    sort: number[]
    id: number
    type: string
    uuid: string
    search_conversions?: any
    attributes: {
      title: string
      slug: string
      rating?: any
      caption: string
      number: number
      description: string
      display_title: string
      length: number
      advert_config: string
      advertising: boolean
      ad_timestamps: string
      public_golive_at: Date
      sponsor_golive_at: Date
      member_golive_at: Date
      original_air_date: Date
      channel_id: string
      channel_slug: string
      season_id: string
      season_slug: string
      season_number: number
      show_title: string
      show_id: string
      show_slug: string
      is_sponsors_only: boolean
      member_tier_i: number
      sort_number: number
      genres: string[]
      is_live: boolean
      is_schedulable: boolean
      season_order: string
      episode_order: string
      downloadable: boolean
      blacklisted_countries: any[]
      upsell_next: boolean
      trending_score: number
      time_boost: number
      credits_start_at?: any
      trending_carousel?: any
    }
    links: {
      self: string
      show: string
      related_shows: string
      channel: string
      season: string
      next: string
      videos: string
      products: string
    }
    canonical_links: {
      self: string
      show: string
    }
    included: {
      images: Image[]
      tags: any[]
      cast_members: any[]
    }
  }
  export interface Show {
    _index: string
    _type: string
    _id: string
    _score?: any
    sort: number[]
    id: number
    type: string
    uuid: string
    search_conversions: Array<{ query: string; count: number }>
    attributes: {
      title: string
      rating?: any
      slug: string
      genres: string[]
      is_sponsors_only: boolean
      updated_at: Date
      published_at: Date
      summary: string
      category: string
      channel_id: string
      channel_slug: string
      season_count: number
      episode_count: number
      last_episode_golive_at: Date
      season_order: string
      episode_order: string
      blacklisted_countries: any[]
      hero_video_url: string
      trending_score: number
      time_boost: number
      schedule: any[]
      schedule_golive_time?: any
      schedule_expires_at?: any
    }
    links: {
      self: string
      seasons: string
      bonus_features: string
      related: string
      product_collections: string
      s1e1: string
      rich_card_reference_url: string
      latest_episode: string
      latest_episodes: {
        sponsor: string
        member: string
        public: string
      }
    }
    canonical_links: {
      self: string
      s1e1: string
    }
    included: {
      images: Image[]
    }
  }

  export interface Channel {
    _index: string
    _type: string
    _id: string
    _score?: any
    sort: number[]
    id: number
    type: string
    uuid: string
    attributes: {
      name: string
      importance: number
      slug: string
      brand_color: string
    }
    included: {
      images: Image[]
    }
    links: {
      self: string
      shows: string
      product_collections: string
      featured_items: string
      episodes: string
      livestreams: string
    }
  }

  export interface Links {
    self: string
    show: string
    related_shows: string
    channel: string
    season: string
    next: string
    videos: string
    products: string
  }

  export interface Tag {
    id: string
    uuid: string
    type: string
    attributes: {
      tag: string
      slug: string
    }
    links: unknown
    included: unknown
  }

  export interface CastMember {
    id: string
    uuid: string
    type: string
    attributes: {
      name
    }
    links: unknown
    included: unknown
  }
  export interface Season {
    _index: string
    _type: string
    _id: string
    _score?: any
    sort: number[]
    id: number
    type: string
    uuid: string
    search_conversions: SearchConversion[]
    attributes: {
      title: string
      slug: string
      rating?: any
      caption: string
      number: number
      description: string
      display_title: string
      length: number
      advert_config: string
      advertising: boolean
      ad_timestamps: string
      public_golive_at: Date
      sponsor_golive_at: Date
      member_golive_at: Date
      original_air_date: Date
      channel_id: string
      channel_slug: string
      season_id: string
      season_slug: string
      season_number: number
      show_title: string
      show_id: string
      show_slug: string
      is_sponsors_only: boolean
      member_tier_i: number
      sort_number: number
      genres: string[]
      is_live: boolean
      is_schedulable: boolean
      season_order: string
      episode_order: string
      downloadable: boolean
      blacklisted_countries: any[]
      upsell_next: boolean
      trending_score: number
      time_boost: number
      credits_start_at?: any
      trending_carousel?: boolean
    }
    links: {
      self: string
      show: string
      related_shows: string
      channel: string
      season: string
      next: string
      videos: string
      products: string
    }
    canonical_links: {
      self: string
      show: string
    }
    included: {
      images: Image[]
      tags: Tag[]
      cast_members: CastMember[]
    }
  }
  export interface Image {
    id: number
    uuid: string
    type: string
    attributes: {
      thumb: string
      small: string
      medium: string
      large: string
      orientation: string
      image_type:
        | 'cover'
        | 'hero'
        | 'mobile_hero'
        | 'poster'
        | 'profile'
        | 'logo'
        | 'title_card'
        | 'cover'
    }
    links: unknown
    included: unknown
  }
}

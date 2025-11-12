import os
import re
import sys
import requests
from dotenv import load_dotenv

load_dotenv()

def extract_linkedin_urls(query, name, company, designation):
    """
    Extract LinkedIn URLs using SerpAPI or Bing Search API
    If name is not provided, returns multiple profiles for the role at the company
    """
    serpapi_key = os.getenv('SERPAPI_KEY')
    
    all_urls = []
    best_url = None
    confidence_score = 0.0
    linkedin_urls = []  # Initialize here to avoid scope issues
    
    try:
        if serpapi_key:
            # Use SerpAPI - increase results if no name provided
            num_results = 20 if not name or not name.strip() else 10
            
            params = {
                'q': query,
                'api_key': serpapi_key,
                'num': num_results
            }
            
            response = requests.get('https://serpapi.com/search', params=params)
            data = response.json()
            
            # Extract URLs from organic results
            if 'organic_results' in data:
                for result in data['organic_results']:
                    url = result.get('link', '')
                    if 'linkedin.com/in/' in url:
                        all_urls.append(url)
        
        # Filter and rank URLs
        linkedin_urls = [url for url in all_urls if '/in/' in url and 'linkedin.com' in url]
        
        if linkedin_urls:
            # If no name provided, return more results
            if not name or not name.strip():
                # Return up to 10 profiles for role-based search
                best_url = linkedin_urls[0] if linkedin_urls else None
                confidence_score = 0.7  # Medium confidence for role-based search
                return {
                    "generated_query": query,
                    "linkedin_url": best_url,
                    "all_urls": linkedin_urls[:10],  # Return top 10 for role search
                    "confidence_score": confidence_score,
                    "search_type": "role_based"
                }
            else:
                # Name-based search - return best match
                best_url = linkedin_urls[0]
                confidence_score = calculate_confidence(best_url, name, company, designation)
        
    except Exception as e:
        print(f"Error in extraction: {str(e)}", file=sys.stderr)
    
    # Determine search type
    search_type = "role_based" if not name or not name.strip() else "name_based"
    
    return {
        "generated_query": query,
        "linkedin_url": best_url,
        "all_urls": linkedin_urls[:10] if not name or not name.strip() else linkedin_urls[:5],
        "confidence_score": confidence_score,
        "search_type": search_type
    }

def calculate_confidence(url, name, company, designation):
    """
    Calculate confidence score based on URL matching
    """
    score = 0.5  # Base score
    
    # Check if name parts are in URL (only if name provided)
    if name and name.strip():
        name_parts = name.lower().split()
        url_lower = url.lower()
        
        for part in name_parts:
            if len(part) > 2 and part in url_lower:
                score += 0.2
    else:
        # For role-based search without name, use medium confidence
        score = 0.7
    
    # Bonus for company match (harder to verify from URL alone)
    score = min(score, 1.0)
    
    return round(score, 2)

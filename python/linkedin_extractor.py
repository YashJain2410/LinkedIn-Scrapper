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
    demo_mode = os.getenv('DEMO_MODE', 'false').lower() == 'true'
    
    all_urls = []
    best_url = None
    confidence_score = 0.0
    linkedin_urls = []  # Initialize here to avoid scope issues
    
    # Demo mode for testing without API
    if demo_mode:
        print("Running in DEMO MODE", file=sys.stderr)
        return generate_demo_results(query, name, company, designation)
    
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

def generate_demo_results(query, name, company, designation):
    """
    Generate demo results for testing without API access
    """
    print(f"Generating demo results for: {name or 'Multiple people'} at {company}", file=sys.stderr)
    
    # Generate realistic-looking LinkedIn URLs
    if name and name.strip():
        # Name-based search
        name_slug = name.lower().replace(' ', '-')
        linkedin_urls = [
            f"https://www.linkedin.com/in/{name_slug}",
            f"https://www.linkedin.com/in/{name_slug}-{company.lower()}",
            f"https://www.linkedin.com/in/{name_slug}-profile",
        ]
        confidence_score = 0.85
        search_type = "name_based"
    else:
        # Role-based search - generate multiple profiles
        designation_slug = designation.lower().replace(' ', '-')
        company_slug = company.lower().replace(' ', '')
        linkedin_urls = [
            f"https://www.linkedin.com/in/{designation_slug}-{company_slug}-1",
            f"https://www.linkedin.com/in/{designation_slug}-{company_slug}-2",
            f"https://www.linkedin.com/in/{designation_slug}-{company_slug}-3",
            f"https://www.linkedin.com/in/{designation_slug}-{company_slug}-4",
            f"https://www.linkedin.com/in/{designation_slug}-{company_slug}-5",
            f"https://www.linkedin.com/in/{designation_slug}-{company_slug}-6",
            f"https://www.linkedin.com/in/{designation_slug}-{company_slug}-7",
            f"https://www.linkedin.com/in/{designation_slug}-{company_slug}-8",
        ]
        confidence_score = 0.7
        search_type = "role_based"
    
    return {
        "generated_query": query,
        "linkedin_url": linkedin_urls[0] if linkedin_urls else None,
        "all_urls": linkedin_urls,
        "confidence_score": confidence_score,
        "search_type": search_type,
        "demo_mode": True
    }

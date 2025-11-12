#!/usr/bin/env python
"""Quick test to check if SerpAPI is working"""
import os
import sys
import json
import requests
from dotenv import load_dotenv

load_dotenv()

# Check environment
print("=" * 70)
print("ENVIRONMENT CHECK")
print("=" * 70)

serpapi_key = os.getenv('SERPAPI_KEY')
print(f"SerpAPI Key found: {'Yes' if serpapi_key else 'No'}")
if serpapi_key:
    print(f"Key starts with: {serpapi_key[:10]}...")

print("\n" + "=" * 70)
print("TESTING SERPAPI")
print("=" * 70)

if not serpapi_key:
    print("❌ ERROR: No SerpAPI key found!")
    print("Please set SERPAPI_KEY in python/.env or server/.env")
    sys.exit(1)

# Test query
query = '"Google" "Software Engineer" site:linkedin.com/in'
print(f"\nTest Query: {query}")

try:
    params = {
        'q': query,
        'api_key': serpapi_key,
        'num': 10
    }
    
    print("\nCalling SerpAPI...")
    response = requests.get('https://serpapi.com/search', params=params, timeout=30)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        
        # Check for errors
        if 'error' in data:
            print(f"❌ API Error: {data['error']}")
            sys.exit(1)
        
        # Extract LinkedIn URLs
        linkedin_urls = []
        if 'organic_results' in data:
            print(f"\nFound {len(data['organic_results'])} organic results")
            
            for i, result in enumerate(data['organic_results'], 1):
                url = result.get('link', '')
                title = result.get('title', '')
                print(f"\n{i}. {title}")
                print(f"   URL: {url}")
                
                if 'linkedin.com/in/' in url:
                    linkedin_urls.append(url)
                    print(f"   ✅ LinkedIn profile found!")
        
        print(f"\n{'='*70}")
        print(f"RESULTS SUMMARY")
        print(f"{'='*70}")
        print(f"Total LinkedIn URLs found: {len(linkedin_urls)}")
        
        if linkedin_urls:
            print("\nLinkedIn URLs:")
            for i, url in enumerate(linkedin_urls, 1):
                print(f"{i}. {url}")
            print("\n✅ SUCCESS! SerpAPI is working correctly.")
        else:
            print("\n⚠️  WARNING: No LinkedIn URLs found in results.")
            print("This might be normal depending on the search query.")
            print("Try with a more specific query or known person.")
    else:
        print(f"❌ HTTP Error: {response.status_code}")
        print(f"Response: {response.text}")
        
except requests.exceptions.Timeout:
    print("❌ ERROR: Request timed out")
    print("Check your internet connection")
except requests.exceptions.RequestException as e:
    print(f"❌ ERROR: {str(e)}")
except Exception as e:
    print(f"❌ ERROR: {str(e)}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 70)

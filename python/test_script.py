#!/usr/bin/env python
"""
Test script to debug the LinkedIn URL finder
"""
import json
from ai_query_generator import generate_query
from linkedin_extractor import extract_linkedin_urls

# Test cases
test_cases = [
    {
        "name": "Sundar Pichai",
        "company": "Google",
        "designation": "CEO",
        "description": "Name-based search"
    },
    {
        "name": "",
        "company": "Google",
        "designation": "Software Engineer",
        "description": "Role-based search (empty name)"
    },
    {
        "name": None,
        "company": "Microsoft",
        "designation": "Product Manager",
        "description": "Role-based search (None name)"
    }
]

print("=" * 70)
print("TESTING LINKEDIN URL FINDER")
print("=" * 70)

for i, test in enumerate(test_cases, 1):
    print(f"\n{'='*70}")
    print(f"TEST {i}: {test['description']}")
    print(f"{'='*70}")
    
    name = test.get('name', '')
    company = test.get('company', '')
    designation = test.get('designation', '')
    
    print(f"\nInput:")
    print(f"  Name: '{name}'")
    print(f"  Company: '{company}'")
    print(f"  Designation: '{designation}'")
    
    try:
        # Generate query
        print(f"\nGenerating query...")
        query = generate_query(name, company, designation)
        print(f"  Query: {query}")
        
        # Extract URLs
        print(f"\nExtracting LinkedIn URLs...")
        result = extract_linkedin_urls(query, name, company, designation)
        
        print(f"\nResults:")
        print(f"  Search Type: {result.get('search_type', 'unknown')}")
        print(f"  Best URL: {result.get('linkedin_url', 'None')}")
        print(f"  Confidence: {result.get('confidence_score', 0) * 100:.0f}%")
        print(f"  Total URLs found: {len(result.get('all_urls', []))}")
        
        if result.get('all_urls'):
            print(f"\n  All URLs:")
            for j, url in enumerate(result.get('all_urls', [])[:5], 1):
                print(f"    {j}. {url}")
        
        print(f"\n  Full JSON:")
        print(f"  {json.dumps(result, indent=2)}")
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()

print(f"\n{'='*70}")
print("TESTING COMPLETE")
print(f"{'='*70}\n")

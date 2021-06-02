import json
import boto3
import requests
import logging
from requests_aws4auth import AWS4Auth
import csv 

credentials = boto3.Session().get_credentials()
awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, 'us-east-1', 'es', session_token=credentials.token)
host = 'search-cocktail-recommender-lgzf4jx4wlile4ytkmcftgi6yi.us-east-1.es.amazonaws.com' 
index = 'cocktails'
url = 'https://' + host + '/' + index + '/_search'

def lambda_handler(event, context):
    
    client, msg = boto3.client('lex-runtime'), event['params']['querystring']['q']
    cocktail_name = getCocktailsByName(client, msg)
    print(cocktail_name)
    recommendationList = []
    if len(cocktail_name) > 0:
        query = {"query": {"match": {"name": cocktail_name}},"size": 600}
        
        headers = {"Content-Type": "application/json"}
        r = requests.get(url, auth=awsauth, headers=headers, data=json.dumps(query))
        data = r.json()
        for ev in range(min(len(data['hits']['hits']), 5)):

            item = data['hits']['hits'][ev]['_source']
            temp = {'id': item['id'], 'name': item['name'], 'imageSrc': item['image']}
            recommendationList.append(temp)
    # print(recommendationList)
    ingredients = getIngredientSlots(client, msg)
    recommendationList.extend(getCocktailsByIngredients(ingredients))
    id_without_dup = set()
    result = [] 
    
    for cocktail in recommendationList:
        if cocktail['id'] not in id_without_dup:
            id_without_dup.add(cocktail['id'])
            result.append(cocktail)
    return {
        'statusCode': 200,
        'body': json.dumps(result)
    }
        
    
    # #q = event['params']['querystring']['q']
    # #q = "I would like a drink with water, vodka and lemon"
    # q = "cookie"
    # client = boto3.client('lex-runtime')
    # response = client.post_text(botName='searchBot', botAlias='searchbot', userId='300', inputText=q)
    
    # if 'slots' not in response.keys():
    #     return {
    #     'statusCode': 200,
    #     'body': json.dumps(" "),
    #     'headers': {
    #         'Access-Control-Allow-Headers' : 'Content-Type',
    #         'Access-Control-Allow-Origin': '*',
    #         'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT'}}

    # x = ''
    # slots = response['slots']
    # print(slots)
    # logger.info(slots)
    # for elem in slots:
    #     #print(slots[elem])
    #     if slots[elem] != None:
    #         print(elem)
    #         x = x + slots[elem] + " "
     
    # if slots['slotOne'] != None:
    #     logger.info('Ingredient')
    #     logger.info(slots['slotOne'])
    #     query = {"query": {"match": {"name": slots['slotOne'] }},"size": 600}
    # else:
    #     query = {"query": {"match": {"ingredients": x}},"size": 600}
        
        
    # credentials = boto3.Session().get_credentials()
    # awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, 'us-east-1', 'es', session_token=credentials.token)
    # host = 'search-cocktail-recommender-lgzf4jx4wlile4ytkmcftgi6yi.us-east-1.es.amazonaws.com' 
    # index = 'cocktails'
    # url = 'https://' + host + '/' + index + '/_search'

    # #query = {"query": {"match": {"ingredients": x}},"size": 600}

    # headers = {"Content-Type": "application/json"}
    # r = requests.get(url, auth=awsauth, headers=headers, data=json.dumps(query))
    # recommendationList = []
    # data = r.json()
    # for ev in range(len(data['hits']['hits'])):
    #     item = data['hits']['hits'][ev]['_source']
    #     temp = {'id': item['id'], 'name': item['name'], 'imageSrc': item['image']}
    #     recommendationList.append(temp)
    # #print(recommendationList)
    # return {
    #     'statusCode': 200,
    #     'body': json.dumps(recommendationList)
    # }

 
def getCocktailsByName(cl, q): 
    response = cl.post_text(botName='nameBot', botAlias='nameBot', userId='300', inputText=q)
    if 'slots' not in response.keys():
        return ""
    else:
        return response['slots']['Name']
    
def getIngredientSlots(cl, q):
    response = cl.post_text(botName='ingredientBot', botAlias='ingredientBot', userId='300', inputText=q)
    if 'slots' not in response.keys():
        return ""
    else:
        slots = response['slots']
        return [slots[slot] for slot in slots if slots[slot]]
        

def getCocktailsByIngredients(ingredients):
    freqs = {}
    values = {}
    length = len(ingredients)
    for ingredient in ingredients:
        query = {"query": {"match": {"ingredients": ingredient}},"size": 600}
    
        headers = {"Content-Type": "application/json"}
        r = requests.get(url, auth=awsauth, headers=headers, data=json.dumps(query))
        data = r.json()
        for ev in range(len(data['hits']['hits'])):
            item = data['hits']['hits'][ev]['_source']
            temp = {'id': item['id'], 'name': item['name'], 'imageSrc': item['image']}
            values[item['id']] = temp
            freqs[item['id']] = 1 if item['id'] not in freqs else freqs[item['id']] + 1

    
    
    return [values[id] for id in freqs if freqs[id] == length]


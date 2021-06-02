##### For Ingredients ####
import csv
import boto3

key = 'all_drinks.csv'
bucket = 'lambda-data-storage'
s3_resource = boto3.resource('s3')
s3_object = s3_resource.Object(bucket, key)
client = boto3.client('lex-models')
values = set()

def lambda_handler(event, context):
    csv_file = s3_object.get()['Body'].read().decode('utf-8').splitlines()
    #print(csv_file)
    
    #csv_reader = csv_file.split(',')
    #print(csv_reader)
    columns = csv_file[0].split(',')
    #print("cols are", columns)
   
    for row in csv_file[1:]:
        splitrow = row.split(',')
        #print(splitrow)
        for i in range(1, len(splitrow)):
            if i < len(splitrow) and i < len(columns) and ('Ingredient' in columns[i]) and len(splitrow[i]) > 0:
                if splitrow[i] not in values and splitrow[i]!= " ":
                    values.add(splitrow[i])
                    #print("row is", splitrow[i])
    
    response = client.get_slot_type(
        name = 'ingredients',
        version='$LATEST'
    )
    checksum = response['checksum']
    
    #print(response['enumerationValues'].values())
    #print("The response is",response['enumerationValues'])
    for el in response['enumerationValues']:
        print(el['value'])
    
    r = []
    for v in values:
        r.append({'value': v})
    
    response = client.put_slot_type(
        name = 'ingredients',
        enumerationValues = r,
        checksum = checksum
    )

"""

### For cocktail names ###   
import csv
import boto3

key = 'all_drinks.csv'
bucket = 'lambda-data-storage'
s3_resource = boto3.resource('s3')
s3_object = s3_resource.Object(bucket, key)
client = boto3.client('lex-models')
values = set()

def lambda_handler(event, context):
    csv_file = s3_object.get()['Body'].read().decode('utf-8').splitlines()
    columns = csv_file[0].split(',')
   
    for row in csv_file[1:]:
        splitrow = row.split(',')
        for i in range(1, len(splitrow)):
            if i < len(splitrow) and i < len(columns) and (columns[i] = 'strDrink') and len(splitrow[i]) > 0:
                if splitrow[i] not in values and splitrow[i]!= " ":
                    values.add(splitrow[i])
                    
    
    response = client.get_slot_type(
        name = 'cocktailnames',
        version='$LATEST'
    )
    checksum = response['checksum']
    #print("The response is",response['enumerationValues'])
    for el in response['enumerationValues']:
        print(el)
    
    r = []
    for v in values:
        r.append({'value': v})
    
    response = client.put_slot_type(
        name = 'cocktailnames',
        enumerationValues = r,
        checksum = checksum
    )
    """
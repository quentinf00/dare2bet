import boto3
import json

def run(event, context):
    dump_state(s3, {}):

    response_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': True,
    }

    return {
        'headers': response_headers,
        'statusCode': 200,
        "body": json.dumps(state)
    }

def dump_state(s3, state):
    print(f'Dumping state: {state}')
    with open('/tmp/state.json', 'w') as data:
        json.dump(state, data)

    with open('/tmp/state.json', 'rb') as data:
        s3.upload_fileobj(data, 'dare-to-bet-state-store', 'state.json')
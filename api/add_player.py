import boto3
import json


def run(event, context):
    player_name = event['queryStringParameters']['player_name']

    s3 = boto3.client('s3')
    state = load_state(s3)
    state['players'] = state.get('players', []) + [player_name]
    dump_state(s3, state)

    response = {
        "statusCode": 200,
        "body": json.dumps(state)
    }

    return response


def load_state(s3):

    bucket_content = s3.list_objects_v2(Bucket='dare-to-bet-state-store')
    print(f"Bucket content {[item['Key'] for item in bucket_content.get('Contents', [])]}")
    if 'state.json' in [item['Key'] for item in bucket_content.get('Contents', [])]:
        print('loading existing state')

        with open('/tmp/state.json', 'wb') as data:
            s3.download_fileobj('dare-to-bet-state-store', 'state.json', data)

        with open('/tmp/state.json', 'r') as data:
            state = json.load(data)
            print(f'Loading state: {state}')
            return state
    else:
        print('Initiating state')
        return {}


def dump_state(s3, state):
    print(f'Dumping state: {state}')
    with open('/tmp/state.json', 'w') as data:
        json.dump(state, data)

    with open('/tmp/state.json', 'rb') as data:
        s3.upload_fileobj(data, 'dare-to-bet-state-store', 'state.json')

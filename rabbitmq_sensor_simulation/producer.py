#!/usr/bin/python

brokerHost  = 'roedeer.rmq.cloudamqp.com'
port        = 5672
username    = 'vnchtioo'
password    = 'BydwQLVAZoaARUMHBfalp8MVDrB152tu'
patientId   = 2
exchange    = 'patientSensorData'

import datetime
import re
import calendar
import json
import time
import pika

def getEventGeneratorFromFile():
    with open('activity.txt') as f:
        while True:
            data = f.readline()

            if data == '':
                break

            yield data

def getPayloadFromEventLine(line):
    parts = re.split(r'\t+', line)[:-1]

    return {
        'patient_id':   patientId,
        'activity':     parts[2],
        'start':        calendar.timegm(datetime.datetime.strptime(parts[0], '%Y-%m-%d %H:%M:%S').timetuple()),
        'end':          calendar.timegm(datetime.datetime.strptime(parts[1], '%Y-%m-%d %H:%M:%S').timetuple())
    }

def prettyPrintEvent(event, name='', id=-1):
    print('[{}] Sent {}event{}{}:\n{}\n'.format(
        datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        '' if name == '' else name + ' ', 
        '' if id == -1 else ' ', 
        '' if id == -1 else id,
        json.dumps(event, indent=4)
    ))

def testSleepRule(channel):
    eventNormal = getPayloadFromEventLine('1970-09-10 00:00:00\t1970-09-10 07:00:00\tSleeping\t\n')
    eventTrigger = getPayloadFromEventLine('1970-09-10 00:00:00\t1970-09-10 07:00:01\tSleeping\t\n')

    sendPayload(json.dumps(eventNormal), channel)

    prettyPrintEvent(eventNormal, 'normal')

    time.sleep(1)

    sendPayload(json.dumps(eventTrigger), channel)

    prettyPrintEvent(eventTrigger, 'triggering')

def testOutdoorRule(channel):
    eventNormal = getPayloadFromEventLine('1970-09-10 00:00:00\t1970-09-10 05:00:00\tLeaving\t\n')
    eventTrigger = getPayloadFromEventLine('1970-09-10 00:00:00\t1970-09-10 05:00:01\tLeaving\t\n')

    sendPayload(json.dumps(eventNormal), channel)

    prettyPrintEvent(eventNormal, 'normal')

    time.sleep(1)

    sendPayload(json.dumps(eventTrigger), channel)

    prettyPrintEvent(eventTrigger, 'triggering')
    
def testBathroomRule(channel):
    event1Normal = getPayloadFromEventLine('1970-09-10 00:00:00\t1970-09-10 00:30:00\tToileting\t\n')
    event2Normal = getPayloadFromEventLine('1970-09-10 00:00:00\t1970-09-10 00:30:00\tShowering\t\n')
    event1Trigger = getPayloadFromEventLine('1970-09-10 00:00:00\t1970-09-10 00:30:01\tToileting\t\n')
    event2Trigger = getPayloadFromEventLine('1970-09-10 00:00:00\t1970-09-10 00:30:01\tShowering\t\n')

    sendPayload(json.dumps(event1Normal), channel)

    prettyPrintEvent(event1Normal, 'normal')

    time.sleep(1)

    sendPayload(json.dumps(event1Trigger), channel)
    
    prettyPrintEvent(event1Trigger, 'triggering')

    time.sleep(1)

    sendPayload(json.dumps(event2Normal), channel)

    prettyPrintEvent(event2Normal, 'normal')

    time.sleep(1)

    sendPayload(json.dumps(event2Trigger), channel)
    
    prettyPrintEvent(event2Trigger, 'triggering')

def sendAllEvents(channel):
    try:
        for index, event in enumerate(list(getEventGeneratorFromFile())):
            payload = getPayloadFromEventLine(event)

            sendPayload(json.dumps(payload), channel)

            prettyPrintEvent(payload, id=index)

            time.sleep(1)
    except KeyboardInterrupt:
        print('\nReceived keyboard interrupt. Stopped sending.')

def sendNextEvent(gen, channel):
    try:
        event = getPayloadFromEventLine(next(gen['gen']))
        sendPayload(json.dumps(event), channel)
        prettyPrintEvent(event)
    
    except StopIteration:
        gen['gen'] = getEventGeneratorFromFile()
        print('Reached the end of the events. Restarting.')

def sendPayload(payload, channel):
    channel.basic_publish(
        exchange=exchange, 
        routing_key='',
        body=payload
    )

def main():
    gen = {}
    gen['gen'] = getEventGeneratorFromFile()

    credentials = pika.PlainCredentials(username, password)
    parameters = pika.ConnectionParameters(brokerHost,
                                       port,
                                       username,
                                       credentials)

    with pika.BlockingConnection(parameters) as connection:

        channel = connection.channel()

        channel.exchange_declare(exchange=exchange, exchange_type='fanout')

        print('For sleep rule press 1\nFor outdoor rule press 2\n' +
            'For bathroom rule press 3\nFor the next event from file press 4\n' +
            'For the all of the events from file press 5')

        while True:
            command = input('> ')

            if command == '1':
                testSleepRule(channel)

            elif command == '2':
                testOutdoorRule(channel)

            elif command == '3':
                testBathroomRule(channel)

            elif command == '4':
                sendNextEvent(gen,channel)
                    
            elif command == '5':
                sendAllEvents(channel)

            else:
                break

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print('\nReceived keyboard interrupt. Exiting.')
import machine, network, time, urequests, ubinascii, micropython, esp, onewire, gc, _thread, bluetooth
from umqttsimple import MQTTClient
from machine import Pin, I2C, Signal
from bme680 import *
from ssd1306 import SSD1306_I2C
from BLE import BLEUART
#############
esp.osdebug(None)
gc.collect()
pin =Pin(16,Pin.OUT) 
pin.value(1) # reset de la pantalla a 1 Para activarla
#############################################
ssid = 'nombre de la red'
password = 'Password'
###############################
## Mosquito
mqtt_server = '192.168.100.5'
user_mosquitto = 'User'
password_mosquitto = 'pass'
################################
client_id = ubinascii.hexlify(machine.unique_id()) # id unica del ECP para crear un cliente MQTT
## tópicos a publicar
topic_pub_temp = b'esp/bme680/temperature'
topic_pub_pres = b'esp/bme680/presion'
topic_pub_hume = b'esp/bme680/humedad'

rx_buffer = ''
toogle = False
#lock = _thread.allocate_lock
station = network.WLAN(network.STA_IF)
#Signal(led2_pin, invert=True) ejemplo de signal
led25 = Pin(25, Pin.OUT)
############################Definición para placa relés arduino
led26_pin = Pin(26, Pin.OPEN_DRAIN)
led26 = Signal(led26_pin, invert=True)#invierte la lógica 0 enciende 1 apaga

led27_pin = Pin(27, Pin.OPEN_DRAIN)
led27 = Signal(led27_pin, invert=True)

led14_pin = Pin(14, Pin.OPEN_DRAIN)
led14 = Signal(led14_pin, invert=True)

led33_pin = Pin(33, Pin.OPEN_DRAIN)
led33 = Signal(led33_pin, invert=True)
#############################
led25.off()
led26.off()
led27.off()
led14.off()
led33.off()
################################################################

def pulso1():
    led26.on()
    #led25.on()
    time.sleep(1)
    led26.off()
    # led25.off()

def pulso2():
    led27.on()
    time.sleep(1)
    led27.off()

def pulso3():
    led14.on()
    time.sleep(1)
    led14.off()    

def pulso4():
    led33.on()
    time.sleep(0.6)
    led33.off()
#Init bluetooth

name = 'ESP32'
ble = bluetooth.BLE()
uart = BLEUART(ble,name)

#Bluetooth RX event
def on_rx():
    global rx_buffer
    rx_buffer=uart.read().decode().strip()
    uart.write('ESP32 says: ' + str(rx_buffer)+'\n')
    if (rx_buffer == 'apagar'):
        led25.off()
        led33.off()
    if (rx_buffer == 'encender'):
        led25.on()
        led33.on()
    if (rx_buffer == 'JOPkjh6785re'):
        _thread.start_new_thread(pulso1, ())
    if (rx_buffer == 'Liu67AQWERjkl'):
        _thread.start_new_thread(pulso2, ())
    if (rx_buffer == 'khdfRTUILOgq12'):
        _thread.start_new_thread(pulso3, ())
    
#Register Bluetooth event
uart.irq(handler=on_rx)

# Conexion a la red wifi
def connection_wifi():
    global station
    station = network.WLAN(network.STA_IF)
    station.active(True)
    if not station.isconnected():
        station.connect(ssid, password)
        while station.isconnected() == False:
          pass
    print('Connection successful')
#####################################
##### PANTALLA
oled = SSD1306_I2C(128, 64, I2C(1, scl=Pin(15), sda=Pin(4))) # I2C pantalla e instancia
oled.fill(0)
oled.text("Estacion Metereológica", 0, 0)
oled.show()
i2c = I2C(0, scl=Pin(22), sda=Pin(21)) #I2C sensor
bme = BME680_I2C(i2c=i2c) #instancia del sensor

ultima_peticion =0
intervalo_peticiones =60
##############################
def connect_mqtt():
  global client_id, mqtt_server
  #client = MQTTClient(client_id, mqtt_server)
  client = MQTTClient(client_id, mqtt_server, user=user_mosquitto, password=password_mosquitto)
  client.connect()
  print('Connected to %s MQTT broker' % (mqtt_server))
  return client

def restart_and_reconnect():
    global toogle 
    print('Failed to connect to MQTT broker. Reconnecting...')
    time.sleep(10)
    toogle = True
    _thread.exit()
# coneccion red wifi 
#_thread.start_new_thread(connection_wifi, ()) 

      
#enviar datos al broker mosquito
def datos_mosquitto():
    #connection_wifi()
    #conexion al broker mosquitto
    try:
      client = connect_mqtt()
    except OSError as e:
      restart_and_reconnect()
    last_message = 0 # ultimo mensaje
    message_interv = 10 # intervalo de tiempo
    while True:
        if (time.time() - last_message) > message_interv:
            #lock.acquire
            temp = str(round(bme.temperature, 2))
            hum = str(round(bme.humidity, 2))
            pres = str(round(bme.pressure, 2))          
            #lock.release
            client.publish(topic_pub_temp,temp)
            client.publish(topic_pub_pres,pres)
            client.publish(topic_pub_hume,hum)
            last_message = time.time()

#crear un hilo para enviar datos al servidor mosquittos    
if station.isconnected():
    _thread.start_new_thread(datos_mosquitto, ())    

#secuencia
while True:
    

    if (time.time() - ultima_peticion) > intervalo_peticiones:
        
        if (toogle == True):
            toogle = False
            #_thread.start_new_thread(datos_mosquitto, ())
        #lock.acquire   
        temp = str(round(bme.temperature, 2))
        hum = str(round(bme.humidity, 2))
        pres = str(round(bme.pressure, 2))
        gas = str(round(bme.gas/1000, 2))
        #lock.release
        ultima_peticion = time.time()
        oled.fill(0)
        oled.text("Estacion Metereológica", 0, 0)
        oled.text("Temp  "+str(temp)+" C", 0, 10)
        oled.text("Hum   "+str(hum)+" %", 0, 20)
        oled.text("Pres  "+str(pres)+" Hpas", 0, 30)
        oled.text("Gas   "+str(gas)+" KOhms", 0, 40)
        oled.text("BT dice "+str(rx_buffer),0, 50)
        oled.show()

    #time.sleep(0.1)
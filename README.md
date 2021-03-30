# Software Defined Networking

Implementation of 2 apps using [Mininet](http://mininet.org/) as a Virtual Network Simulator and [OpenDaylight](https://www.opendaylight.org/) Software-Defined-Networking Controller (both open source projects).

### Table of Contents

[Project Summary](#summary)

[The Team](#team)

[The Stack](#stack)

[Tools Used](#tools)

[How to install](#install)

[How to run](#run)

[Applications](#apps)

&nbsp;&nbsp;&nbsp;&nbsp;[Network Creation](#create)

&nbsp;&nbsp;&nbsp;&nbsp;[Network Overview](#overview)

&nbsp;&nbsp;&nbsp;&nbsp;[Flow Creation](#flow)

&nbsp;&nbsp;&nbsp;&nbsp;[Network Deletion](#delete)

<a name="summary"/>

# Project Summary:

Our project consists of a react frontend and a flask (python) backend, communicating via custom RESTful API. The react frontend retrieves information from OpenDaylight via its own API to visually display it, while the backend interacts with OpenDaylight by both retrieving and sending data. Furthermore, the backend is responsible for the more sophisticated tasks, regarding network manipulation (e.g. Mininet Virtual Network Creation-Ping-Deletion, Custom Network Flows Creation-Evaluation-Deletion), triggered by frontend requests. On frontend start, checks are performed to determine whether a network already exists by asking backend about the status. If not, you will be redirected to a network creation form.

<a name="team"/>

# The Team:

[Ioannis Papadopoulos](https://github.com/JohnPapad)

[Ioannis Lamprou](https://github.com/YannisLamp)

[Dimitris Gangas](https://github.com/dimitrisgan)

[Nemanja Nedic](https://www.linkedin.com/in/nemanja-nedic/)


<a name="stack"/>

# The Stack:

![stack image](https://github.com/YannisLamp/network-management/blob/master/SDN.png "The Stack")

<a name="tools"/>

# Tools used:
<li>
    React: Router, d3 (for graph visualization), reactstrap (for UI/UX), axios (for HTTP requests)
</li>

<li>
    Python 2.7: Flask (micro web framework), Mininet (library)
</li>

<a name="install"/>

# How to install:

After mininet and OpenDaylight installation, 

```cd net-man-app && sudo npm install```

```cd net-man-backend && sudo pip install -r requirements.txt```

<a name="run"/>

# How to run:

In this sequence:

```export TERM=exterm-color```

```./distribution-karaf-0.5.4-Boron-SR4/bin/karaf –of13```

```sudo python2 backend.py```

```cd net-man-app && sudo npm start```

Navigate to: 

```http://localhost:3000```

Login to OpenDaylight: (optional)

```localhost:8181/index.html```

```user: admin```

```pass: admin```

<a name="apps"/>

# Applications:

<a name="create"/>

## Network Creation:

### Description:

A graphical Mininet network creation interface, built by react framework, providing many different network options through a web form, making the creation and deletion of networks effortless, so that our Network Applications (Network Overview, Flows Creation) can be used on a wide range of possible network instances.

### How to use it:

Select the network properties or just press default values.    
This demo shows how to create a network on the app:
![alt text](https://github.com/YannisLamp/network-management/blob/master/create_network.gif "Create Network")

NOTE: Djikstra is pointless for a Linear Network, so if you want to inspect that functionality don't choose Linear.        
NOTE: If tree topology is selected, it might take some time to create the network since the network size increases exponentially based on the input parameters. We suggest that for demo purposes you select a smaller network tree or just leave the default values.

### How it works:

The network is created with this command ``` Mininet(topo=topology, controller=controller, switch=switch, autoSetMacs=mac, waitConnected=True)``` by the backend using the ```mininet``` python lib, based on the parameters passed from our frontend, via our RESTful custom API. (a POST request is sent to the backend ```/network```.)

As soon as the network is created it is started and a ```net.pingAll()``` is called along with ```mininet.util.dumpNodeConnections(net.hosts)``` so that we establish all new connections. 

NOTE: Before any network instance creation, in case the backend was abruptly stopped, possible previous network clutter is cleaned with a call to ```sudo mn -c``` and any leftover flows from a previous sessions will be deleted via the OpenDaylight API.


<a name="overview"/>

## App1 - Network Overview:

### Description:

An interactive, fully clickable custom graph, visualizing a created Mininet network, which serves extensive information for each host, switch or link, and overall network statistics on side panels, provided by the Opendaylight API.

### How to use it:
This is a demo of the Network Overview app and the stastistics it provides:
![alt text](https://github.com/YannisLamp/network-management/blob/master/network_overview.gif "Network Overview")

If the user clicks on any host, switch or link, both on the graph or the side panel, information relevant to that selection takes their place. This way, the user can focus on the network as a whole as well as have access to more specialized node information.

NOTE: Rx: # received, Tx: # transmitted

### How it works:

After retrieving the needed network data from OpenDaylight via its API, and the data is proccessed and transformed properly, it is passed to react-d3 to be visually displayed. All additional information about hosts, switches and links are stored in a react state. Using on-click listeners and handlers information and statistics about the current status of the network are retrieved and presented.

### Why we chose it:
Our line of thought for building this App, was that the existing network visualisation interface provided by Opendaylight was somewhat difficult to navigate, spanning multiple pages and ultimately not communicating the whole range of information available, so we thought it would be a good idea to expand it, making it more intuitive and user friendly, especially for users without previous relative experience with network management.

<a name="flow"/>

## App2 - Flows Creation:

### Description:

A Flow creation tool, which after prompting the user to pick two hosts from a graphical representation of a created Mininet network, calculates the shortest path between the chosen nodes using the Dijkstra algorithm, then proceeds to impose flows, based on that path. 

### How to use it:

![alt text](https://github.com/YannisLamp/network-management/blob/master/create_flow.gif "Shortest Path Between nodes")

### How it works:
Frontend sends a POST request to ```/shortest_path```.     
Backend answers to that request with a list of node-ids that represent the shortest path.     
The Frontend then displays the shortest path with a blue line on the topo-graph and then sends a POST request to ```/flows``` in order to create the necessary flows.      
The backend then calls ```/restconf/config/opendaylight-inventory:nodes/node/{{openflow_id}}/table/{{table_id}}/flow/{{flow_id}}```

with:

```
{'flow': [{
        'id': flow_id,
        'match': {'ethernet-match': {'ethernet-source': {'address': src_mac_address},
                                     'ethernet-destination': {'address': dest_mac_address},
                                     'ethernet-type': {'type': '0x800'}}},
        'instructions': {'instruction': [
            {'apply-actions': {'action': [{'output-action': {'output-node-connector': port_number}, 'order': '1'}]},
             'order': '1'}]},
        'installHw': 'false',
        'table_id': table_id}]}
```

In order to create the new flow.

### Why we chose it:
Our reasoning for choosing to implement this application is that as making packet transfers as fast and effective as possible is a fundamental networking element, it would be interesting to measure and compare transfer times with and without the use of flows and ultimately determine how much of an improvement the addition of flows is for the given network.


![alt text](https://github.com/YannisLamp/network-management/blob/master/norm_flows.png "Normal Flows")

![alt text](https://github.com/YannisLamp/network-management/blob/master/big_flows.png "Big Flows")


<a name="delete"/>

## Network Deletion:

### How to use it:

![alt text](https://github.com/YannisLamp/network-management/blob/master/delete_network.gif "Network delete")

### How it works:

Front sends DELETE request to ```/network```.     
Backend then deletes all flows that we created (kept in global ```gflows_list```).    
Network is stopped ```global_net.stop()``` and ```{'msg': 'Network Stopped'}``` is returned.

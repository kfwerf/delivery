# Delivery for GRPC
![Screenshot](https://raw.githubusercontent.com/kfwerf/delivery/master/screenshot/wip2.png)

GRPC GUI client for GRPCurl

[![Build Status](https://travis-ci.org/miguelbaldi/delivery.svg?branch=make-linux)](https://travis-ci.org/miguelbaldi/delivery)

## What is it?
**TL;DR; GRPCurl wrapper that auto detects methods and persists all history of requests,
thanks to [GRPCurl](https://github.com/fullstorydev/grpcurl).**

I created a simple GUI wrapper for GRPCurl, [GRPCurl](https://github.com/fullstorydev/grpcurl).
This is a attempt at creating a simple tool that can speed up communication to the server. It has
support for history, meaning anything you type and do will persist in a historic log and state.

## What can it do?
Because GRPCurl uses reflection we can auto detect everything. You fill in the url of your server and the
application auto detects the methods (thanks to GRPCurl). It has a history of what has been used before, so
lets say you where on server.fantastic.com and using method myMethod.v1.beautiful/UnicornRainbows with { unicorns: true }. It will auto fill this in when clicking on the method or travelling to the server. It is meant to grossly
simplify the interaction between you and GRPCurl.

## Getting Started

To build from source, first checkout the code

### Prerequisites

Required tools to build native packages

* [node.js and npm](https://www.npmjs.com/get-npm)

#### Run from source

```sh
npm run start
```

#### Build native packages

On **Linux** you should have some tools

Fedora based distro:

```sh
sudo dnf install dpkg-dev fakeroot
```

Debian based distro:

```sh
sudo apt-get install rpm fakeroot
```

##### Installation

On the project folder, run
```sh
npm install
```
Then generate the native package(s)
```sh
npm run make
```
The output should be at `out/make/`



## Great, is it done?
![Logo](https://raw.githubusercontent.com/kfwerf/delivery/master/screenshot/logo.png)

There is a first version (0.0.2), there might be bugs. If there are please file a ticket.

### V0.0.2
[Mac OSX](https://github.com/kfwerf/delivery/releases/download/v0.0.2/Delivery-darwin-x64-0.0.2.zip)

### V0.0.1
[Mac OSX](https://github.com/kfwerf/delivery/releases/download/v0.0.1/Delivery-darwin-x64-0.0.1.zip)


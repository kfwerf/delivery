![Logo](https://raw.githubusercontent.com/kfwerf/delivery/master/screenshot/logo.png)
# Delivery for GRPC
![Screenshot](https://raw.githubusercontent.com/kfwerf/delivery/master/screenshot/desktop-macosx.png)

GRPC GUI client for GRPCurl

[![Build Status](https://travis-ci.org/miguelbaldi/delivery.svg?branch=make-linux)](https://travis-ci.org/miguelbaldi/delivery)

## What is it?
**TL;DR; GRPCurl wrapper that auto detects methods and types, simplifying your gRPC experience,
thanks to [GRPCurl](https://github.com/fullstorydev/grpcurl).**

I created a simple GUI wrapper for GRPCurl, [GRPCurl](https://github.com/fullstorydev/grpcurl).
This is a attempt at creating a simple tool that can speed up communication to the server. It has
support for history, meaning anything you type and do will persist in a historic log and state.

## What can it do?
As long as you provide the url, delivery will do it's best to discover/auto detect all the
methods and types. It will try to provide the methods and an example of the body for each method.
This way you can easily write your GRPC commands without having to figure out the JSON structure.

## Where do i get it?
There is a version (0.1.0), there might be bugs. If there are please file a ticket.

## Latest version
Recently delivery has been revised, using a newer forge with React and Typescript

### V0.1.0
[Mac OSX](https://github.com/kfwerf/delivery/releases/download/v0.1.0/Delivery-darwin-x64-0.1.0.zip)

## Archived versions

### V0.0.2
[Mac OSX](https://github.com/kfwerf/delivery/releases/download/v0.0.2/Delivery-darwin-x64-0.0.2.zip)

### V0.0.1
[Mac OSX](https://github.com/kfwerf/delivery/releases/download/v0.0.1/Delivery-darwin-x64-0.0.1.zip)



## Getting Started
To build from source, first checkout the code

### Prerequisites
Required tools to build native packages

* [node.js and npm](https://www.npmjs.com/get-npm)

#### Run from source
```sh
npm install
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
The output should be at `out/`
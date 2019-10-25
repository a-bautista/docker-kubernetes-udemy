<b>Summary:</b> This project contains useful notes to understand the basics of Docker. Refer to the repo multi-docker-dockerhub-ci to see the notes related to Kubernetes and the full integration with docker.  

### Table of contents

|No| folder name               | Content description |
|--|:--------------------------|:--------------------|
|1 | previous-to-docker-react  | Files that demonstrate how to add a simple docker image and how to run it (hello-world and redis-image folders) and how to create a docker file and build its context (simpleweb and visits folder).|
|2 | files with no folder      | The set of files that are in the main folder were used to show how to automate the process of uploading docker images to Docker Hub and via Travis and then getting the updating copies in an app.|
|3 | complex-react-app         | Working app that uses Docker hub as a reference to get the updated images from Docker hub and then changes are reflected immediately in the working app. Also, multiple services are initiated such as an express server, a postgres db, a redis server and a worker.|
|4 | Reference notes         | Useful commands to know in Docker.|

### 1. previous-to-docker-react 

#### simpleweb

<b>simpleweb</b> shows how to build a docker file and then how to execute it with `docker build .`. Once you have built the docker image you can to tag it with `docker build -t previous-docker-react/simpleweb:latest . ` where previous-to-docker is like an <i>id</i>, <i>simpleweb</i> is the name of the project and <i>:latest</i> is the version. Remember that what the previous commands perform is to install the dependencies from the package.json file which contains the express dependency and a script to execute the index.js file. In order to make this a Docker container you have to execute `docker run -p 8080:8080 previous-to-docker/simpleweb` and then you will this app mapped into port 8080. 

<b>visits</b> shows how to build a <i>docker-compose</i> file which indicates the <i>multiple services</i> that are going to be established. In my docker-compose.yml file I indicated to establish a redis server and launch a node app in specific ports. In order to initialize the multiple services in docker containers at the same time you have to execute `docker-compose up --build` to build the image and run the image at the same time. If you only need to run the multiple services without rebuilding the image then you can use `docker-compose up` to initialize all the services. Notice that in this folder I set up the restarting policies (see attached image). 

### 2. files with no folder

The files with no folder are used to tell Travis to automatically connect to Github and then build the images that are specified in the Dockerfile (remember that Dockerfile.dev is used for the Dev server and Dockerfile with no extension is used for the production server). The Docker files have a multi step process, that is, our docker file initiates node and nginx, so node can initialize React and nginx can handle the requests from the browser and can give in turn the appropriate .jsx files from React.

Dockerfile multiple phases

<b>Build phase</b>
1. node:alpine gets all the required files to install dependencies
2. copy package.json file 
3. install dependencies
4. run `npm run build`

<b>Run phase</b>
1. Use nginx
2. Copy over the result of `npm run build`
3. start nginx

Every time this repo is updated, Travis automatically gets this latest code and rebuilds the images. 

In order to run this container you execute `docker-compose up` and if you have done any changes to the Dockerfile don't forget to apply the changes and run the image with `docker-compose up --build`.

### 3. complex-react-app

This app is a multi-container application because it has various images that are initiated as containers. Every image has its own Dockerfile because we need to setup dependencies for the nginx server, the node server, the React app (client folder) and the worker. 

The docker-compose.yml file organizes the full setup for the multi-container application. See code on these files for further reference.

There are some files called default.conf that are used for nginx to be fully setup. See code on these files for further reference.

The .travis file. is used to connect Travis with Github so we can get the latest code, then the images are rebuild and pushed to Dockerhub and optionally we can upload these latest images to an AWS instance (this last option is commented in the .travis file). See the diagrams to have a full picture about how these services interact with each other. 

In order to start using the set of container for this multi-docker set of images just run `docker-compose up` to initialize the container and if you do any changes to the images then do not forget to rebuild the images with `docker-compose up --build`. 


### 4. Reference notes

#### What is Docker?

Docker is a platform or ecosystem for creating and running containers. 

#### What is a container? 

Docker works with images which are files that contain all dependencies and configuration files for running a program. <b>When an image is running or when it is instantiated then we say we have a container</b>. Containers have its own isolated configuration of hardware, that is, the hardware from your computer is not related to the hardware of the image. 

#### Why use Docker?

Docker makes it simple to install and run software without worrying about setup or dependency libraries. 

#### How does Docker work?

When you initialize an image,i.e., `docker run hello-world`, the docker client in your machine checks if you already have that image in your image cache and if this is not the case then the docker client contacts the docker server so this one contacts the DockerHub to request the image, then the image is stored in your image cache so you can have it ready the next time you want to execute it.

      _________________
     |                 |
     |   docker client |
     |        |        |
     |        v        |
     |   docker server |-----> when image not found, then docker server contacts ----> Docker Hub
     |        |        |
     |        v        |
     |   image cache   |
     |_________________|


#### Containers

Remember that a container is an instance of an image that is running. Suppose we want to run a legacy program that needs Python 2.7 and you need to use Chrome which needs needs Python 3.7. How do you setup these 2 Python versions in one same machine? You can use containers to maintain both versions of Python.

     ________________________________________ 
    |  Container A           Container B     |
    |   ----------------    --------------   |
    |  | Legacy program |  |   Chrome     |  |
    |  |      |         |  |      |       |  |
    |  |      v         |  |      v       |  |
    | -------------------------------------- |
    | ||  Python 2.7    |  |   Python 3.7 || |
    | ||                |  |              || |
    | | ----------------    -------------- | |
    | |              Hard Disk             | |
    | |------------------------------------| |
    | ______________________________________ |

Both versions of Python are stored in the Hard disk because a <b>namespace</b> or dedicated space in your disk was dedicated for both versions. Container A has isolated resources and processes for executing Python 2.7 without interfering the processes and resources for Container B. 

Remember that namespacing and control groups belong to Linux and when you install Docker in Windows or MACOS, a Linux virtual machine gets installed so you can use the namespacing and control groups.

#### Images

An image has a file system snapshot, dependencies and startup commands to execute a program. 
         
          _____________________________________________________
         |                                                    |
         |                          Image                     |
         | -------------------------------------------------- |
         |                            |                       |
         | File System snapshot       | Startup commands      |
         |                            |                       |
         | -------------------------- | ----------------------|
         |                            |                       |
         | Legacy program, Python 2.7 | Python setup.py build |
         |                            |                       |
         |____________________________________________________|
         
Note that <i>image_id</i> or <i>container_id</i> are used indistinctible in the following commands but just recap that a container is an image which is being executed. 

#### How to create your own images in Docker?

In order to run your images as containers you need to create a Dockerfile by:

1. Specifying a base image.
2. Defining the dependencies for your image.
3. Specifying commands to initialize the image as a container when the system starts.

This is a classic example of how to write a Docker file:

##### FROM alpine
##### RUN apk add --update redis
##### CMD ["redis-server"]

In the lines from above, I am specifying to the Docker server to use alpine to download a set of pre-installed programs, then Docker updates redis and initializes the redis server. 

##### `docker build .` - This is how you can build your image once you have set up the docker file.

This is what happens when you build your image:
          
             _______________________________________
            |                                       |
            |              My computer              |
            |   ---------------------------------   |
            |  |                                |   |
            |  |  Container                     |   |
            |  | -------------------------------|   |
            |  |    ---------------             |   |
            |  |   |  redis-server |            |   |
            |  |    ---------------             |   |
            |  |           |                    |   |
            |  |           v                    |   |
            |  || ----------------------------------|   
            |  ||        Kernel                     |
            |  ||-----------------------------------|
            |  |                                |   |       
            |  |  ------   -------   -----      |   |
            |  | |  RAM | |Network| | CPU |     |   |
            |  |  ------   -------   -----      |   |
            |  |  Files                         |   |
            |  |                                |   |
            |  |   -----  ----  ----            |   |
            |  |  | bin | dev | etc |           |   |
            |  ---------------------------------|   |
            |_______________________________________|  

The image is built and a specific portion of RAM, CPU and processes have been created as well as a file system. Once the image is running, which is a container, you can control the actions of the container from your machine local machine.  

##### `docker build -t alejandro/pythonprogram:latest .` - Tag your docker images

##### `docker run -p 3001:8080 alejandro/pythonprogram` - Port mapping - this is a very important topic because once your container is up and running, you can get access to it either through the shell or by a port, that is, in your browser you can see the results of your container. The first port is your machine port and the second port is the port from your container.

##### `docker run -it alejandro/pythonprogram sh` - Debug a container by getting access to its shell

##### `docker exec -it <image_id> sh` - Debug a container by getting access to its shell when it is already running

#### Run multiple Docker containers with Docker Compose

Docker compose allows us to start multiple Docker containers at the same time, for instance, if we want to start a redis server and a node server then we can create this in a `docker-compose.yml` file.

##### `docker-compose up` - Execute the `.yml` file to initialize the multiple containers.

##### `docker build .` - Rebuild the docker file image.

##### `docker-compose up --build` - Rebuild the `.yml` file and initialize the multiple containers.

##### `docker-compose up -d` - Start all your docker images and put them in the background.

##### `docker-compose down` - Shutdown the multiple docker containers.

##### `docker build -f Dockerfile.dev .` - Rebuild a single docker image (Dockerfile.dev). We usually use this command with the -f for rebuilding the .dev file.

#### Docker volumes

Whenever we edit any file from the local folder, then we have to rebuild the image with docker to reflect the changes but you can use docker volumes to avoid this step.

                _________________         _____________________
               |                 |       |                     |
               |   Local folder  |       |   Docker container  |
                -----------------        ----------------------|
               |    frontend     |  <--- |      reference      |
               |-----------------|       |---------------------|
               |      /src       |  <--- |      reference      |
               |_________________|       |_____________________|


##### `docker run -p 3000:3000 -v /app/node_modules -v $(pwd):/app <image_id>` - The docker volumes can be initialized in the `.yml` file or by terminal command.

Please refer to the docker-compose.yml file from the root folder to see how we converted this command into a script to be executed by Docker when doing `docker-compose up`. 

#### Useful commands to know in Docker

##### `docker run <image_name>` - Execute an image container with docker.

##### `docker-compose up` - It is used to start multiple Docker containers at the same time.

##### `docker ps` - It lists all the containers that are currently running. 

##### `docker ps -a` - Same as `docker ps` but with more detailed information.

##### `docker image ls` - List all the docker images.

##### `docker ps --all` - Lists all the containers that were executed.

##### `docker rmi <image_id>` - Remove a docker image from the docker image cache by providing the image_id.

##### `docker rmi <name_of_the_container>` - Remove a docker image from the docker image cache by providing the name of the container.

##### `docker create <image_name> <command>` - Docker command to create an image.

##### `docker start -a <image_id>` - Docker command to start an image.

##### `docker run <image_name>` - Docker command to create and start an image at the same time.

##### `docker system prune` - Erase all the containers that were executed and remove images from the image cache.

##### `docker logs <container_id>` - Review the logs of a container

##### `docker stop <container_id>` - Stop a container 

##### `docker kill <container_id>` - Stop a container immediately

##### `docker exec -it <container_id> <command_to_run>` - Execute a command in a container (you need to open another terminal tab and run this command while the container is up).

##### `docker exec -it <container_id> sh` - Start a shell in the container.


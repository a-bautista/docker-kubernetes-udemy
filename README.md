This project contains useful notes to understand the basics of Docker and Kubernetes. 

## What is Docker?

Docker is a platform or ecosystem for creating and running containers. 

## What is a container? 

Docker works with images which are files that contain all dependencies and configuration files for running a program. <b>When an image is running or when it is instantiated then we say we have a container</b>. Containers have its own isolated configuration of hardware, that is, the hardware from your computer is not related to the hardware of the image. 

## Why use Docker?

Docker makes it simple to install and run software without worrying about setup or dependency libraries. 

## Useful commands to know in Docker

### `docker run <image_name>` 

Execute an image container with docker.

### `docker-compose up` 

It is used to start multiple Docker containers at the same time.

### `docker ps`

It lists all the containers that are currently running. 

### `docker ps -a`

Same as `docker ps` but with more detailed information.

### `docker ps --all`

Lists all the containers that were executed.

### `docker rmi <image_id>`

Remove a docker image from the docker image cache by providing the image_id.

### `docker rmi <name_of_the_container>`

Remove a docker image from the docker image cache by providing the name of the container.

## How does Docker work?

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


## Containers

Remember that a container is an instance of an image that is running. Suppose we want to run a legacy program that needs Python 2.7 and you need to use Chrome which needs needs Python 3.7. How do you setup these 2 Python versions in one same machine? You can use containers to maintain both versions of Python.

     ________________________________________ 
    |  Conatiner A           Container B     |
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

## Images

An image has a file system snapshot, dependencies and startup commands to execute a program. 
          ____________________________________________________
         |                          Image                     |
         | -------------------------------------------------- |
         | File System snapshot       |                       |
         | -------------------------- | ----------------------|
         | Legacy program, Python 2.7 | Python setup.py build |
         |____________________________________________________|
         
Note that <i>image_id</i> or <i>container_id</i> are used indistinctible in the following commands but just recap that a container is an image which is being executed. 

Docker command to create an image.

### `docker create <image_name> <command>`

Docker command to start an image.

### `docker start -a <image_id>`

Docker command to create and start an image at the same time.

### `docker run <image_name>`

Erase all the containers that were executed and remove images from the image cache.

### `docker system prune`

Review the logs of a container

### `docker logs <container_id>

Stop a container 

### `docker stop <container_id>

Stop a container immediately

### `docker kill <container_id>

Execute a command in a container (you need to open another terminal tab and run this command while the container is up).

### `docker exec -it <container_id> <command_to_run>

Start a shell in the container.

### `docker exec -it <container_id> sh

## How to create your own images in Docker?

In order to run your images as containers you need to create a Dockerfile by:

1. Specifying a base image.
2. Executing some commands to add extra software.
3. Specifying commands to initialize the image as a container when the system starts.


The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

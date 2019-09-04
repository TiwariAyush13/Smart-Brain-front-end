import React, {Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';
import Navigation from './Components/Navigation/Navigation';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import './App.css';

const app = new Clarifai.App({
    apiKey: '18f8b5989ca34bdab2b9ba569d942b8e'
   });

const particlesOption = {
    particles: {
        number: {
            value: 150,
            density: {
                enable: true,
                value_area: 700
            }
        },
        move: {
            enable: true,
            speed: 10 
            }
    }
}
    
class App extends Component {
    constructor() {
        super();
        this.state= { 
            input: '',
            imageUrl: '',
            box: {},
            route: 'signin',
            isSignedIn: false
        } 
    }

calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
    }
}

displayFaceBox = (box) => {
    this.setState({box: box});
}

    onInputChange=(event) => {
        this.setState({input: event.target.value});
    }

    onButtonSubmit=() => {
        this.setState({imageUrl: this.state.input});
        app.models
            .predict(
                Clarifai.FACE_DETECT_MODEL,
                this.state.input)
            .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
            .catch(err => console.log(err));
    }

    onRouteChange = (route) => {  
        if (route === 'signout') {
            this.setState({isSignedIn: false})
        } else if (route === 'home') {
            this.setState({isSignedIn: true})
        }
        this.setState({route: route});
    }

    render() {
        const { isSignedIn, imageUrl, route, box} = this.state;
        return (
            <div className="App">
                <Particles className = 'Particles' 
                    params={particlesOption}                  
                /> 
                <Navigation isSignedIn={isSignedIn}  onRouteChange={this.onRouteChange} />
                { route === 'home' 
                    ? <div>
                        <Logo />
                        <Rank /> 
                        <ImageLinkForm 
                            onInputChange = {this.onInputChange} 
                            onButtonSubmit = {this.onButtonSubmit} 
                        />
                        <FaceRecognition box={box} imageUrl={imageUrl} />
                    </div>
                    : (
                        route === 'signin'
                         ? <Signin onRouteChange={this.onRouteChange}/>
                         : <Register onRouteChange={this.onRouteChange}/> 
                    )
                }
            </div>
        ); 
    }

}

export default App;
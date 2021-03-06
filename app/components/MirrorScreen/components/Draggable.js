/**
 *	* https://github.com/tongyy/react-native-draggable
 *
 */

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    View,
    Text,
    Image,
    PanResponder,
    Animated,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';


export default class Draggable extends Component {
    static propTypes = {
        renderText:PropTypes.string,
        renderShape:PropTypes.string,
        renderSize:PropTypes.number,
        dataSource:PropTypes.object,
        imageSource:PropTypes.oneOfType([
            PropTypes.shape({
                uri: PropTypes.string,
            }),
            PropTypes.number
        ]),
        offsetX:PropTypes.number,
        offsetY:PropTypes.number,
        renderColor:PropTypes.string,
        reverse:PropTypes.bool,
        pressDrag:PropTypes.func,
        onMove:PropTypes.func,
        pressDragRelease:PropTypes.func,
        longPressDrag:PropTypes.func,
        pressInDrag:PropTypes.func,
        pressOutDrag:PropTypes.func,
        z:PropTypes.number,
        x:PropTypes.number,
        y:PropTypes.number

    };
    static defaultProps = {
        offsetX : 100,
        renderShape : 'circle',
        renderColor : 'yellowgreen',
        renderText : '＋',
        renderSize : 36,
        offsetY : 100,
        reverse : true
    }

    componentWillMount() {
        if(this.props.reverse === false)
            this.state.pan.addListener((c) => this.state._value = c);
    }
    componentWillUnmount() {
        this.state.pan.removeAllListeners();
    }
    componentWillReceiveProps(props)
	{
		if(props.reverse !== undefined)
		{
			console.log("REVERS");
           if(props.reverse === true)
		   {   this.fromRevers();
               console.log("REVERS", props.reverse)}
		   else {
           	 this.state.pan.addListener((c) => this.state._value = c);
               this.fromRevers();
               console.log("REVERS", props.reverse)

		   }
		}
	}

    constructor(props, defaultProps) {
        super(props, defaultProps);
        const { pressDragRelease, reverse, onMove, dataSource } = props;
        this.state = {
            pan:new Animated.ValueXY(),
            _value:{x: 0, y: 0}
        };

        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: (e, gestureState) => {
                if(reverse === false) {
                    this.state.pan.setOffset({x: this.state._value.x, y: this.state._value.y});
                    this.state.pan.setValue({x: 0, y: 0});
                }
            },
            onPanResponderMove: Animated.event([null,{
                dx:this.state.pan.x,
                dy:this.state.pan.y
            }], {listener: onMove}),
            onPanResponderRelease: (e, gestureState) => {
                if(pressDragRelease)
                    pressDragRelease(e, gestureState);
                let Window = Dimensions.get('window');
                let itemPositionX = (gestureState.moveX + 55 - 120);
                let itemPositionY = (gestureState.moveY + 55 - 230);
                pressDragRelease(e, gestureState , itemPositionX , itemPositionY , dataSource);
                console.log("LOG", (gestureState.moveX + 55 - 120), (gestureState.moveY + 55 - 230) , Window.width , Window.height );
                if(reverse === false)
                    this.state.pan.flattenOffset();
                else
                    this.reversePosition();
            }
        });
    }

    fromRevers(){
        const { pressDragRelease, reverse, onMove, dataSource } = this.props;
        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: (e, gestureState) => {
                if(reverse === false) {
                    this.state.pan.setOffset({x: this.state._value.x, y: this.state._value.y});
                    this.state.pan.setValue({x: 0, y: 0});
                }
            },
            onPanResponderMove: Animated.event([null,{
                dx:this.state.pan.x,
                dy:this.state.pan.y
            }], {listener: onMove}),
            onPanResponderRelease: (e, gestureState) => {
                if(pressDragRelease)
                {
                    let itemPositionX = (gestureState.moveX + 55 - 120);
                    let itemPositionY = (gestureState.moveY + 55 - 230);
                    pressDragRelease(e, gestureState , itemPositionX , itemPositionY , dataSource);
                    let Window = Dimensions.get('window');
                   // console.log("itemPosition", itemPositionX, itemPositionY , Window.width , Window.height , dataSource );
                }
                if(reverse === false)
                    this.state.pan.flattenOffset();
                else
                    this.reversePosition();
            }
        });
	}

    _positionCss = () => {
        let Window = Dimensions.get('window');
        const { renderSize, offsetX, offsetY, x, y, z } = this.props;
        return Platform.select({
            ios: {
                zIndex: z != null ? z : 999,
                position: 'absolute',
                top: y != null ? y : (Window.height / 2 - renderSize + offsetY),
                left: x !=null ? x : (Window.width / 2 - renderSize + offsetX)
            },
            android: {
                position: 'absolute',
                width:Window.width,
                height:Window.height,
                top: y != null ? y : (Window.height / 2 - renderSize + offsetY),
                left: x !=null ? x : (Window.width / 2 - renderSize + offsetX)
            },
        });
    }

    _dragItemCss = () => {
        const { renderShape, renderSize, renderColor , x ,y} = this.props;
        if(renderShape === 'circle') {
            return{
                backgroundColor: renderColor,
                width: renderSize * 2,
                height: renderSize * 2,
				x:x * 2,
				y:y * 2,
                borderRadius: renderSize
            };
        }else if(renderShape === 'square') {
            return{
                backgroundColor: renderColor,
                width: renderSize * 2,
                height: renderSize * 2,
                x:x * 2,
                y:y * 2,
                borderRadius: 0
            };
        }else if(renderShape === 'image') {
            return{
                width: renderSize,
                height: renderSize,

            };
        }
    }
    _dragItemTextCss = () => {
        const { renderSize } = this.props;
        return {
            marginTop: renderSize-10,
            marginLeft: 5,
            marginRight: 5,
            textAlign: 'center',
            color: '#fff'
        };
    }
    _getTextOrImage = () => {
        const { renderSize, renderShape, renderText, imageSource } = this.props;
        if(renderShape === 'image') {
            return(<Image style={this._dragItemCss(renderSize, null, 'image')} source={imageSource}/>);
        }else{
            return (<Text style={this._dragItemTextCss(renderSize)}>{renderText}</Text>);
        }

    }

    reversePosition = () => {
        Animated.spring(
            this.state.pan,
            {toValue:{x:0,y:0}}
        ).start();
    }

    render() {
        const touchableContent = this._getTextOrImage();
        const { pressDrag, longPressDrag, pressInDrag, pressOutDrag, dataSource } = this.props;

        return (
            <View style={this._positionCss()}>
                <Animated.View
                    {...this.panResponder.panHandlers}
                    style={[this.state.pan.getLayout()]}
                >


                    <TouchableOpacity
                        style={this._dragItemCss()}
                        onPress={pressDrag}
                        //onLongPress={longPressDrag}
                        onPressIn={pressInDrag}
                        onPressOut={pressOutDrag}
                        //delayLongPress={1000}

                    >
                        {touchableContent}
                    </TouchableOpacity>
					 </Animated.View>


            </View>
        );
    }
}



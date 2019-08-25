import React from 'react'

import {
    Animated,
    Platform,
    TextInput,
    View
} from 'react-native'

export default class TextField extends React.Component {
    state = {
        labelFontSize: new Animated.Value(16),
        labelPosition: new Animated.Value(Platform.OS != 'ios' ? 22.5 : 12.5),
        selected: false,
        show: true,
        value: ''
    }

    componentDidMount() {
        if(this.props.value != undefined) {
            this.setFill(this.props.value);
        }
    }

    render() {
        let {
            labelFontSize,
            labelPosition
        } = this.state;

        let color = "teal"

        return(
            <View
                style = {[
                    this.props.style,
                    {
                        marginBottom: Platform.OS == 'ios' ? 0 : -15,
                        marginTop : Platform.OS == 'ios' ? 5 : -5,
                        paddingTop: 5
                    },
                ]}
            >
                <View
                    style = {{
                        borderBottomWidth: Platform.OS == 'ios' ? 1 : 0,
                        borderColor: this.state.selected ? color : "gray",
                        paddingVertical: 7.5,
                    }}
                >
                    <TextInput
                        autoCapitalize        = {this.props.autoCapitalize}
                        autoCorrect           = {this.props.autoCorrect != undefined ? this.props.autoCorrect : false}
                        editable              = {this.props.editable == undefined ? true : this.props.editable}
                        keyboardType          = {this.props.keyboardType}
                        maxLength             = {this.props.maxLength}
                        multiline             = {this.props.multiline}
                        onBlur                = {() => {
                            if(this.props.onBlur != undefined) {
                                this.props.onBlur();
                            }
                            
                            this.select(false);
                        }}
                        onChangeText          = {(value) => this.onChangeText(value)}
                        onFocus               = {() => this.select(true)}
                        onSubmitEditing       = {this.onSubmitEditing}
                        ref                   = {input => this.input = input}
                        returnKeyType         = {this.props.returnKeyType}
                        secureTextEntry       = {this.props.secureTextEntry}
                        selectionColor        = {color}
                        style                 = {{
                            fontSize: 16,
                            height: this.props.height != undefined ? this.props.height : null,
                            paddingBottom: Platform.OS == 'ios' ? 0 : 7.5,
                            textAlignVertical: 'top',
                        }}
                        underlineColorAndroid = {this.state.selected ? color : "gray"}
                        value                 = {this.state.value}
                    />
                </View>

                {
                    this.state.show ?
                        <Animated.View
                            pointerEvents = 'none'
                            style         = {{
                                left: Platform.OS == 'ios' ? 0 : this.props.labelBehavior == 'hide' ? (Platform.Version >= 21 ? 5 : 10) : 2.5,
                                paddingHorizontal: 0,
                                position: 'absolute',
                                top : labelPosition,
                            }}
                        >
                            <Animated.Text
                                style = {{
                                    color: "gray",
                                    fontSize: labelFontSize,
                                }}
                            >
                                {this.props.label}
                            </Animated.Text>
                        </Animated.View>
                        :
                        null
                }
            </View>
        )
    }

    onSubmitEditing = () => {
        if(this.props.onSubmitEditing != undefined) {
            this.props.onSubmitEditing();
        }
    }

    onChangeText(value) {
        this.setState({value: value});

        if(this.props.onChangeText != null) {
            this.props.onChangeText(value);
        }

        if(this.props.labelBehavior == 'hide') {
            if(this.state.show && value != '') {
                this.setState({show: false});
            }

            if(!this.state.show && value == '') {
                this.setState({show: true});
            }
        }
    }

    setFill(value) {
        if(value != '') {
            if (this.props.labelBehavior != 'hide') {
                this.setState({
                    labelFontSize: new Animated.Value(12),
                    labelPosition: new Animated.Value(Platform.OS == 'ios' ? -5 : (Platform.Version >= 21 ? 5 : -5))
                });
            } else {
                this.setState({
                    labelFontSize: new Animated.Value(16),
                    labelPosition: Platform.OS != 'ios' ? 22.5 : 12.5
                });

                if(this.state.show && value != '') {
                    this.setState({show: false});
                }
    
                if(!this.state.show && value == '') {
                    this.setState({show: true});
                }
            }
        }

        this.setState({value: value});
    }

    select(selectState) {
        this.setState({selected: selectState});

        if (this.props.labelBehavior != 'hide') {
            if(selectState) {
                Animated.timing(                 
                    this.state.labelPosition,          
                    {
                        duration: 100,              
                        toValue : Platform.OS == 'ios' ? -5 : (Platform.Version >= 21 ? 5 : -5)
                    }
                ).start();
    
                Animated.timing(                 
                    this.state.labelFontSize,          
                    {
                        duration: 100,              
                        toValue : 12
                    }
                ).start();
            } else {
                if((this.props.multiline && this.state.value.toString() == "") || (!this.props.multiline && this.state.value.toString().trim().replace(/ +(?= )/g,'') == '')) {
                    Animated.timing(                 
                        this.state.labelPosition,          
                        {
                            duration: 100,              
                            toValue : Platform.OS != 'ios' ? 22.5 : 12.5
                        }
                    ).start();
    
                    Animated.timing(                 
                        this.state.labelFontSize,          
                        {
                            duration: 100,              
                            toValue : 16
                        }
                    ).start();
                }
    
                this.setState({value: this.props.multiline ? this.state.value.toString() : this.state.value.toString().trim().replace(/ +(?= )/g,'')});
            }
        }
    }
}
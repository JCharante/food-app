import {Incubator, TextFieldProps} from "react-native-ui-lib";
import React, { ComponentProps } from 'react'

const { TextField } = Incubator

// https://stackoverflow.com/a/59137835

export interface InternalTextFieldProps extends ComponentProps<typeof TextField>{

}

export const InternalTextField = (props: InternalTextFieldProps) => {
    return <TextField {...props}
                      showCharCounter={props.showCharCounter === undefined ? true : props.showCharCounter}
                      fieldStyle={{
                          borderRadius: 3,
                          borderColor: '#E5E5E5',
                          borderWidth: 1,
                          borderStyle: 'solid',
                          backgroundColor: '#ffffff'
                      }}
    />
}
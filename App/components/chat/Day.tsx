import * as React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextProps,
} from 'react-native'

// import moment from 'moment-timezone';
import Color from 'react-native-gifted-chat/lib/Color';
import { IMessage } from 'react-native-gifted-chat/lib/Models';
import { StylePropType } from 'react-native-gifted-chat/lib/utils';
// import GeneralUtil from '../../utils/GeneralUtil';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  text: {
    backgroundColor: Color.backgroundTransparent,
    color: Color.defaultColor,
    fontSize: 12,
    fontWeight: '600',
  },
})

export interface DayProps<TMessage extends IMessage = IMessage> {
  currentMessage?: TMessage
  nextMessage?: TMessage
  previousMessage?: TMessage
  containerStyle?: StyleProp<ViewStyle>
  wrapperStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  textProps?: TextProps
  dateFormat?: string
  inverted?: boolean
}

// export function isSameDay(
//   currentMessage: IMessage,
//   diffMessage: IMessage | null | undefined,
// ) {
//   if (!diffMessage || !diffMessage.createdAt) {
//     return false
//   }

//   const currentCreatedAt = moment(currentMessage.createdAt)
//   const diffCreatedAt = moment(diffMessage.createdAt)

//   if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid()) {
//     return false
//   }

//   return currentCreatedAt.isSame(diffCreatedAt, 'day')
// }

export function Day<TMessage extends IMessage = IMessage>({
  dateFormat = "",
  currentMessage,
  previousMessage,
  containerStyle,
  wrapperStyle,
  textStyle,
}: DayProps<TMessage>) {

  // if (currentMessage == null || isSameDay(currentMessage, previousMessage)) {
  //   return null
  // }

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={wrapperStyle}>
        <Text style={[styles.text, textStyle]}>
          {/* {GeneralUtil.capitalizeText(moment(currentMessage.createdAt).format('MMM DD, YYYY'))} */}
          Today
        </Text>
      </View>
    </View>
  )
}

Day.propTypes = {
  currentMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  inverted: PropTypes.bool,
  containerStyle: StylePropType,
  wrapperStyle: StylePropType,
  textStyle: StylePropType,
  dateFormat: PropTypes.string,
}

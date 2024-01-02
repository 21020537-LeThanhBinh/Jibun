import { GestureResponderEvent, Pressable, Text, StyleSheet, View } from "react-native";
// import { IconType } from "react-icons";

interface ButtonProps {
  label?: string;
  onPress: ((event: GestureResponderEvent) => void) | null | undefined;
  disabled?: boolean;
  outline?: boolean;
  warning?: boolean;
  small?: boolean;
  // icon?: IconType;
  style?: any;
  children?: React.ReactNode;
}

const MyButton: React.FC<ButtonProps> = ({
  label,
  onPress,
  disabled,
  outline,
  warning,
  small,
  // icon: Icon,
  style,
  children,
}) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, style, outline && styles.buttonOutline]}
    >
      {/* {Icon && (
        <Icon
          size={24}
          className="
            absolute
            left-4
            top-3
          "
        />
      )} */}
      {!disabled && children}
      {label && (
        <Text style={[styles.text, outline && styles.textOutline]}>
          {label}
        </Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#177AD5',
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textOutline: {
    color: '#177AD5',
  },
});

export default MyButton;
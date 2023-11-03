import { GestureResponderEvent, Pressable, Text, StyleSheet, View } from "react-native";
// import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  onPress: ((event: GestureResponderEvent) => void) | null | undefined;
  disabled?: boolean;
  outline?: boolean;
  warning?: boolean;
  small?: boolean;
  // icon?: IconType;
  style?: any;
}

const MyButton: React.FC<ButtonProps> = ({
  label,
  onPress,
  disabled,
  outline,
  warning,
  small,
  // icon: Icon,
  style
}) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, style, outline && styles.buttonOutline]}
      // className={`
      //   relative
      //   disabled:opacity-70
      //   disabled:cursor-not-allowed
      //   rounded-lg
      //   hover:opacity-80
      //   transition
      //   w-full
      //   ${warning ? 'bg-red-500' : outline ? 'bg-white' : 'bg-sky-500'}
      //   ${warning ? 'border-red-500' : outline ? 'border-black' : 'border-sky-500'}
      //   ${outline ? 'text-black' : 'text-white'}
      //   ${small ? 'text-sm' : 'text-md'}
      //   ${small ? 'py-1' : 'py-3'}
      //   ${small ? 'font-light' : 'font-semibold'}
      //   ${small ? 'border-[1px]' : 'border-2'}
      // `}
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
      <Text style={[styles.text, outline && styles.textOutline]}>
        {label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 20,
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
    color: 'blue',
  },
});

export default MyButton;
import { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, View } from 'react-native';
import { AirbnbRating } from 'react-native-elements';

export default function SleepQualityRatingModal({ modalVisible, setSleepQuality }: { modalVisible: boolean, setSleepQuality: (q: number) => void }) {
  const [rating, setRating] = useState(3);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setSleepQuality(0)
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>How would you rate your sleep quality?</Text>
          <View>
            <AirbnbRating
              count={5}
              reviews={["Terrible", "Bad", "OK", "Good", "Great"]}
              defaultRating={rating}
              size={40}
              onFinishRating={(rate) => { setRating(rate); setSleepQuality(rate) }}
              selectedColor="#f1c40f"
            // unSelectedColor="#f1c40f"
            // customRatingIcons={Array(5).fill(0).map((_, i) => customIcon(i + 1))}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
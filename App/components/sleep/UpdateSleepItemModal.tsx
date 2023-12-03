import { useState, useEffect } from 'react';
import { Alert, Modal, StyleSheet, Text, View, Pressable } from 'react-native';
import { AirbnbRating } from 'react-native-elements';
import { ISleep } from '../../types/SleepItem';
import DatePicker from 'react-native-date-picker';
// import DatePicker from 'react-native-datepicker';

export default function UpdateSleepItemModal({ modalVisible, sleepItem, setSleepItem }: { modalVisible: boolean, sleepItem: ISleep | null, setSleepItem: (s: ISleep) => void }) {
  const [startTime, setStartTime] = useState(sleepItem ? new Date(sleepItem.startTime) : new Date());
  const [endTime, setEndTime] = useState(sleepItem ? new Date(sleepItem.endTime) : new Date());
  const [rating, setRating] = useState(sleepItem ? sleepItem.quality : 0);
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)

  useEffect(() => {
    if (sleepItem) {
      setStartTime(new Date(sleepItem.startTime))
      setEndTime(new Date(sleepItem.endTime))
      setRating(sleepItem.quality)
    }
    
  }, [sleepItem])

  const handleStartTimeChange = (time: Date) => {
    setStartTime(time);
    if (new Date(time) > new Date(endTime)) {
      setEndTime(time);
    }
  };

  const handleEndTimeChange = (time: Date) => {
    if (new Date(time) >= new Date(startTime)) {
      setEndTime(time);
    } else {
      alert('End time cannot be before start time');
    }
  };

  const onSave = () => {
    if (!sleepItem) return

    setSleepItem({ ...sleepItem, startTime: startTime.getTime(), endTime: endTime.getTime(), quality: rating })
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        // setSleepQuality(0)
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
            <Text style={styles.modalText}>Edit sleep history</Text>
            <Pressable onPress={onSave}>
              <Text style={{ color: '#177AD5', fontWeight: '700' }}>Save</Text>
            </Pressable>
          </View>

          <View style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
            <View>
              <Text>Start:</Text>
              {/* <DatePicker
                date={startTime}
                mode="time"
                format="HH:mm"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(timeStr, time) => handleStartTimeChange(time)}
                showIcon={false}
              /> */}
              <Pressable onPress={() => setOpen1(true)} style={{
                borderRadius: 5,
                padding: 10,
                width: 100,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                marginTop: 10,
              }}>
                <Text style={{ fontSize: 16 }}>{startTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</Text>
              </Pressable>
              <DatePicker
                modal
                open={open1}
                date={startTime}
                onConfirm={(date) => {
                  setOpen1(false)
                  handleStartTimeChange(date)
                }}
                onCancel={() => {
                  setOpen1(false)
                }}
              />
            </View>

            <View>
              <Text>End:</Text>
              <Pressable onPress={() => setOpen2(true)} style={{
                borderRadius: 5,
                padding: 10,
                width: 100,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                marginTop: 10,
              }}>
                <Text style={{ fontSize: 16 }}>{endTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</Text>
              </Pressable>
              <DatePicker
                modal
                open={open2}
                date={endTime}
                onConfirm={(date) => {
                  setOpen2(false)
                  handleEndTimeChange(date)
                }}
                onCancel={() => {
                  setOpen2(false)
                }}
              />
            </View>
          </View>
          <View>
            <AirbnbRating
              count={5}
              reviews={["Terrible", "Bad", "OK", "Good", "Great"]}
              defaultRating={rating}
              size={40}
              onFinishRating={(rate) => { setRating(rate) }}
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
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
  },
});
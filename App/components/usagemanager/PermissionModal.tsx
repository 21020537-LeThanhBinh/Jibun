import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import RTNUsageStats from 'rtn-usagestats/js/NativeUsageStats';

const PermissionModal = ({
  modalVisible,
  setModalVisible
}: {
  modalVisible: boolean,
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}
) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Grant usage access permission to Jibun to continue</Text>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible)
                RTNUsageStats?.enableUsageStats()
              }}>
              <Text style={styles.textStyle}>Grant permission</Text>
            </Pressable>

            <Pressable
              style={[styles.button]}
              onPress={() => {
                setModalVisible(!modalVisible)
              }}>
              <Text style={styles.textStyle}>Later</Text>
            </Pressable>
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

export { PermissionModal };
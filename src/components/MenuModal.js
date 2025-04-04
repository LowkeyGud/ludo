import React, {useCallback} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch} from 'react-redux';
import {goBack} from '../helpers/NavigationUtil';
import {playSound} from '../helpers/SoundUtility';
import {resetGame} from '../redux/reducers/gameSlice';
import GradientButton from './GradientButton';

const MenuModal = ({visible, onPressHide}) => {
  const dispatch = useDispatch();

  const handleNewGame = useCallback(() => {
    dispatch(resetGame());
    playSound('game_start');
    onPressHide();
  }, [dispatch, onPressHide]);

  const handleHome = useCallback(() => {
    goBack();
  }, []);

  return (
    <Modal
      style={styles.bottomModalView}
      visible={visible}
      backdropColor="black"
      transparent={true}
      animationType="fade"
      onRequestClose={onPressHide}>
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={['#0f0c29', '#302b63', '#24243e']}
          style={styles.gradientContainer}>
          <View style={styles.subView}>
            <GradientButton title="RESUME" onPress={onPressHide} />
            <GradientButton title="NEW GAME" onPress={handleNewGame} />
            <GradientButton title="HOME" onPress={handleHome} />
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

export default MenuModal;

const styles = StyleSheet.create({
  bottomModalView: {
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  gradientContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
    paddingVertical: 40,
    width: '100%',
    borderWidth: 2,
    borderColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subView: {
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
});

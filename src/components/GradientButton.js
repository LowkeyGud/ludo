import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {RFValue} from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const COLOR = '#fff';

const iconsSize = RFValue(20); // Adjusted icon size for better visibility
const GradientButton = ({title, onPress, iconColor = COLOR}) => {
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        style={styles.btnContainer}
        onPress={() => {
          playSound('ui');
          onPress();
        }}
        activeOpacity={0.8}>
        <LinearGradient
          colors={['#2ecc71', '#e67e22']} // Greenish to orange gradient
          start={{x: 0, y: 0}} // Left to right gradient
          end={{x: 1, y: 0}}
          style={styles.gradient}>
          {title === 'RESUME' ? (
            <MaterialCommunityIcons
              name="play-circle-outline"
              size={iconsSize}
              color={iconColor}
            />
          ) : (
            <MaterialCommunityIcons
              name="play"
              size={iconsSize}
              color={iconColor}
            />
          )}
          <Text style={styles.buttonText}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

import {StyleSheet} from 'react-native';
import {playSound} from '../helpers/SoundUtility';

const styles = StyleSheet.create({
  mainContainer: {
    // borderRadius: 10,
    // borderWidth: 2,
    // borderColor: '#000',
    marginVertical: 10,
  },
  btnContainer: {
    // borderWidth: 2,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: 'white',
    shadowColor: COLOR,
    shadowOpacity: 0.5,
    shadowRadius: 1,
    borderColor: COLOR,
    width: 220,
  },
  gradient: {
    paddingVertical: 12, // Slimmer padding for a sleek look
    paddingHorizontal: 40, // Balanced horizontal padding
    borderRadius: 8, // Softer corners
    shadowColor: '#000', // Subtle shadow for depth
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3, // Android shadow
    flexDirection: 'row',
    gap: 10, // Space between icon and text
    alignItems: 'center', // Center icon and text vertically
    justifyContent: 'center', // Center content horizontally
  },
  buttonText: {
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#fff', // White text for contrast
    fontSize: 14, // Slightly smaller, modern size
    fontWeight: 'bold', // Bold for emphasis
  },
});

export default GradientButton;

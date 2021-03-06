import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParams} from '../navigation/StackNavigator';
import useUniverses from '../hooks/useUniverses';
import {globalStyles} from '../theme/globalStyles';
import globalColors from '../theme/globalColors';
import useFighters from '../hooks/useFighters';
import LoadingIndicator from '../components/LoadingIndicator';
import FighterCard from '../components/FighterCard';
import ItemSeparator from '../components/ItemSeparator';
import {useAppSelector, useAppDisptatch} from '../reducers/hooks';
import {callFightersAPI} from '../reducers/fighters/middlewares';
import {ALL_UNIVERSE} from '../constants/generalConstants';

export default function HomeScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
  const {isLoading: universesLoading, universeList} = useUniverses();
  const fighters = useAppSelector(state => state.fighters);
  const dispatch = useAppDisptatch();
  const [selectedUniverse, setSelectedUniverseName] = useState(ALL_UNIVERSE);
  const {darkBlue, primaryBlue} = globalColors;

  useEffect(() => {
    dispatch(callFightersAPI(selectedUniverse));
  }, [selectedUniverse]);

  function renderUniversesSection() {
    if (universesLoading) {
      return <LoadingIndicator />;
    }
    return (
      <FlatList
        data={universeList}
        keyExtractor={item => item.objectID}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={() => (
          <TouchableOpacity
            style={{
              ...styles.universeButton,
              backgroundColor:
                selectedUniverse === ALL_UNIVERSE ? darkBlue : primaryBlue,
            }}
            onPress={() => setSelectedUniverseName(ALL_UNIVERSE)}>
            <Text style={styles.universeText}>All</Text>
          </TouchableOpacity>
        )}
        renderItem={({item}) => (
          <TouchableOpacity
            style={{
              ...styles.universeButton,
              backgroundColor:
                selectedUniverse === item.name ? darkBlue : primaryBlue,
            }}
            onPress={() => setSelectedUniverseName(item.name)}>
            <Text style={styles.universeText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    );
  }

  function renderFightersSection() {
    if (fighters.isLoading) {
      return <LoadingIndicator />;
    }
    return (
      <FlatList
        data={fighters.visibleList}
        keyExtractor={(item, index) => item.objectID + index}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('FighterScreen', {fighter: item})
            }>
            <FighterCard
              fighter={item}
              index={index}
              style={styles.fighterCard}
            />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <ItemSeparator />}
      />
    );
  }

  return (
    <View style={styles.mainContainer}>
      {/* Universes List */}
      <View style={styles.universesContainer}>{renderUniversesSection()}</View>
      {/* Fighters List */}
      <View style={styles.fightersContainer}>{renderFightersSection()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  universesContainer: {
    height: 80,
    backgroundColor: 'white',
  },
  universeButton: {
    height: 50,
    backgroundColor: globalColors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 2,
    minWidth: 80,
  },
  universeText: {
    color: globalColors.white,
  },
  fightersContainer: {
    flex: 1,
  },
  fighterCard: {
    height: 100,
  },
});

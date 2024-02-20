import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import md5 from 'md5';
import { useNavigation } from '@react-navigation/native';

const publicKey = '1ab2cb49fed486865b7e0a10bdabba62';
const privateKey = 'b171001d62097fd606a3cb755ff7eb05e882779b';
const timeStamp = new Date().getTime();
const hash = md5(timeStamp + privateKey + publicKey);

const CharacterList = () => {
  const navigation = useNavigation();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://gateway.marvel.com/v1/public/characters?ts=${timeStamp}&apikey=${publicKey}&hash=${hash}`)
      .then(response => response.json())
      .then(responseJson => {
        setCharacters(responseJson.data.results);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CharacterDetails', { characterId: item.id })}>
      <Image source={{ uri: `${item.thumbnail.path}.${item.thumbnail.extension}` }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.description || 'No description available.'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={characters}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
  );
};

    const styles = StyleSheet.create({
        container: {
          padding: 20,
        },
        title: {
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 10,
        },
        description: {
          fontSize: 16,
          marginBottom: 10,
        },
        image: {
          width: '100%',
          height: 300,
          resizeMode: 'contain',
          marginBottom: 20,
        },
      });
      export default CharacterList;

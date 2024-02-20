import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import md5 from 'md5';

const screenWidth = Dimensions.get('window').width; // Obtén el ancho de la pantalla

const publicKey = '1ab2cb49fed486865b7e0a10bdabba62';
const privateKey = 'b171001d62097fd606a3cb755ff7eb05e882779b';
const timeStamp = new Date().getTime();
const hash = md5(timeStamp + privateKey + publicKey);

const App = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      fetch(`http://gateway.marvel.com/v1/public/characters?ts=${timeStamp}&apikey=${publicKey}&hash=${hash}`)
          .then(response => response.json())
          .then(responseJson => {
              if (responseJson.data && responseJson.data.results) {
                  setCharacters(responseJson.data.results);
              } else {
                  console.error('Invalid API response', responseJson);
              }
              setLoading(false);
          })
          .catch(error => {
              console.error('Fetching error: ', error);
              setLoading(false);
          });
  }, []);

  const renderItem = ({ item }) => (
      <View style={styles.card}>
          <Text style={styles.title}>{item.name}</Text>
          <Image source={{ uri: `${item.thumbnail.path}.${item.thumbnail.extension}` }} style={styles.image} />
          <Text style={styles.description}>{item.description || 'No description available.'}</Text>
          <Text style={styles.authors}>{"Authors: " + (item.creators?.items.map(creator => creator.name).join(', ') || 'No authors available.')}</Text>

      </View>
  );

  return (
      <View style={styles.container}>
          <Text style={styles.headerTitle}>Películas</Text>
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
    flex: 1,
    backgroundColor: '#202124',
    alignItems: 'center',
    paddingTop: 40, 
  },
  headerTitle: {
    fontSize: 40, 
    fontWeight: 'bold',
    color: '#ffffff', 
    marginBottom: 30, 
  },
  card: {
    backgroundColor: '#ffffff', 
    borderRadius: 20, 
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 6, 
    alignItems: 'center',
    width: screenWidth - 40,
    shadowColor: '#ff0000', 
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000000', 
  },
  image: {
    width: screenWidth * 0.6, 
    height: screenWidth * 0.6,
    borderRadius: (screenWidth * 0.6) / 2, 
    marginVertical: 20,
    borderWidth: 3, 
    borderColor: '#ff0000', 
  },
  description: {
    fontSize: 18,
    color: '#333',
    paddingHorizontal: 20,
    textAlign: 'center',
    marginBottom: 10, 
  },
  actorsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#ff0000', 
  },
  actorName: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5, 
  },
});

export default App;

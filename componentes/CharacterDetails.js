import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';

const CharacterDetails = ({ route }) => {
  const { characterId } = route.params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `https://gateway.marvel.com:443/v1/public/characters/${characterId}?ts=1&apikey=PUBLIC_KEY&hash=HASH`;
    fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        setDetails(responseJson.data.results[0]);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
      });
  }, [characterId]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{details.name}</Text>
      <Image source={{ uri: `${details.thumbnail.path}.${details.thumbnail.extension}` }} style={styles.image} />
      <Text style={styles.description}>{details.description || 'No description available.'}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
});

export default CharacterDetails;

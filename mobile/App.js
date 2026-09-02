import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
const COLORS = { positive: '#16a34a', neutral: '#64748b', negative: '#dc2626' };

export default function App() {
  const [text, setText] = useState('I love how simple and helpful this app is!');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true); setError('');
    try {
      const response = await fetch(`${API_URL}/analyze`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ text }) });
      if (!response.ok) throw new Error('The analysis service is unavailable.');
      setResult(await response.json());
    } catch (e) { setError(`${e.message} Check the API URL and try again.`); }
    finally { setLoading(false); }
  };

  return <SafeAreaView style={styles.safe}>
    <StatusBar style="light" />
    <View style={styles.hero}><Text style={styles.eyebrow}>NATURAL LANGUAGE PROCESSING</Text><Text style={styles.title}>Sentiment Lens</Text><Text style={styles.subtitle}>Understand the tone behind any message.</Text></View>
    <View style={styles.card}>
      <Text style={styles.label}>Text to analyze</Text>
      <TextInput style={styles.input} value={text} onChangeText={setText} multiline maxLength={2000} placeholder="Type a review or message…" />
      <Text style={styles.counter}>{text.length}/2000</Text>
      <TouchableOpacity style={styles.button} onPress={analyze} disabled={loading}>{loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Analyze sentiment</Text>}</TouchableOpacity>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
    {result && <View style={styles.result}>
      <Text style={styles.label}>Result</Text>
      <View style={styles.resultRow}><View style={[styles.dot,{backgroundColor:COLORS[result.label]}]} /><Text style={[styles.sentiment,{color:COLORS[result.label]}]}>{result.label.toUpperCase()}</Text><Text style={styles.confidence}>{Math.round(result.confidence*100)}% confidence</Text></View>
      <Text style={styles.explain}>Signal words: {result.contributions.map(x => x.token).join(', ') || 'none detected'}</Text>
    </View>}
  </SafeAreaView>;
}

const styles = StyleSheet.create({safe:{flex:1,backgroundColor:'#0f172a',padding:24},hero:{marginTop:50,marginBottom:28},eyebrow:{color:'#67e8f9',fontSize:12,fontWeight:'700',letterSpacing:1.5},title:{color:'white',fontSize:40,fontWeight:'800',marginTop:8},subtitle:{color:'#cbd5e1',fontSize:17,marginTop:7},card:{backgroundColor:'white',borderRadius:22,padding:20},label:{fontSize:13,fontWeight:'700',color:'#475569',textTransform:'uppercase',letterSpacing:.8},input:{height:145,borderWidth:1,borderColor:'#cbd5e1',borderRadius:14,padding:14,fontSize:16,marginTop:10,textAlignVertical:'top'},counter:{color:'#94a3b8',textAlign:'right',fontSize:12,marginTop:5},button:{backgroundColor:'#0891b2',height:52,borderRadius:14,alignItems:'center',justifyContent:'center',marginTop:14},buttonText:{color:'white',fontSize:16,fontWeight:'700'},error:{color:'#dc2626',marginTop:12},result:{backgroundColor:'#f8fafc',borderRadius:22,padding:20,marginTop:18},resultRow:{flexDirection:'row',alignItems:'center',marginTop:14},dot:{width:12,height:12,borderRadius:6,marginRight:9},sentiment:{fontWeight:'800',fontSize:19},confidence:{color:'#64748b',marginLeft:'auto'},explain:{color:'#475569',marginTop:13,lineHeight:20}});

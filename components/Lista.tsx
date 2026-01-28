import { AppContext } from '@/context/AppContextProvider';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {}

const Lista = (props: Props) => {
  const [array, setarray] = useState<number[]>([]);
  function generarAleatorios(){
    let cantidad = 10; 
    let arr: number[] = [];
    for(let i=0; i<cantidad;i++){
      let aleatorio= Math.trunc(Math.random()*100);
      arr.push(aleatorio);
    }
    setarray(arr);
  }
  useEffect(() => {
    generarAleatorios();
  }, [])
  
  const context=useContext(AppContext);
  const router= useRouter();
  const [usu, setUsu] = useState<string>("")
  return (
    <SafeAreaView style={{ backgroundColor:"black",flex: 1}}>
      {
        array.map(numero =>
          <Button
            key={numero}
            title={'Ir a casa  num: '+ numero}
            onPress={() => {
              context.setusuario(usu);
              router.push('/casas');
            }}
          />
        )
      }
      <Text>
        pon tu usuario: 
      </Text>
      <TextInput onChangeText={(texto)=>setUsu(texto)} placeholder="usuario"/>
      
      
    </SafeAreaView>
    
  )
}

export default Lista
import { useState, useEffect } from 'react';
import {  useToast, FlatList } from 'native-base';

import { api } from '../services/api';

import { Loading } from './Loading';
import { Game, GameProps } from '../components/Game';

interface Props {
  poolId: string;
}

export function Guesses({ poolId }: Props) {
  const [ isLoading, setIsLoading ] = useState(true);
  const [ games, setGames ] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');

  const toast = useToast();
//criar o palpite
  async function handleGuessConfirm(gameId: string) {
    try {
        if (!firstTeamPoints.trim() || !secondTeamPoints){
          return toast.show({
            title: 'Informe o placar completo',
            placement: 'top',
            bgColor: 'red.500'
        }); 
        }
        console.log(poolId)
        console.log(gameId)
        await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
          firstTeamPoints: Number(firstTeamPoints),
          setSecondTeamPoints: Number(setSecondTeamPoints),
        })
      
        toast.show({
          title: 'Palpite realizado com sucesso',
          placement: 'top',
          bgColor: 'green.500'
      });  

      fetchGames();

    } catch (error) {
        console.log(error);

        toast.show({
            title: 'Não foi possível carregar o palpite',
            placement: 'top',
            bgColor: 'red.500'
        });  
    }
}

  async function fetchGames() {
    try {
      setIsLoading(true);

      const response = await api.get(`/pools/${poolId}/games`);
      console.log(response.data.games);
      setGames(response.data.games);
    } catch (error) {
      console.log(error);

      toast.show({
          title: 'Não foi possível carregar os jogos',
          placement: 'top',
          bgColor: 'red.500'
      });   
  } finally {
      setIsLoading(false);
  }
    
  }

  useEffect(()=> {
    fetchGames();
  }, [poolId]);

  if (isLoading) {
    return <Loading />
  }

  return (
    <FlatList 
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <Game 
          data={ item }
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
    />
  );
}

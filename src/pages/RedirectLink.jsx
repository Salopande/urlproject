import { storeClicks } from '@/db/apiClicks';
import { getLongUrl } from '@/db/apiUrl';
import useFetch from '@/hooks/useFetch';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners';

const RedirectLink = () => {
  const { id } = useParams();
  const { loading, data, fn } = useFetch(getLongUrl, id)

  const { loading: loadingState, fn: fnState } = useFetch(storeClicks, {
    id: data?.id,
    original_url: data?.original_url
  })
  console.log(data)
  useEffect(() => {
    fn();
  }, [])

  useEffect(() => {
    if (!loading && data) {
      fnState();
    }
  }, [loading])

  if (loading || loadingState) {
    return (
      <>
      <BarLoader width={"100%"} color='#36d7b7'/>
      <br/>
      Redirecting...
      </> 
    )
  }

}

export default RedirectLink
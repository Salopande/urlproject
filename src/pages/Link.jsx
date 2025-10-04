import { urlState } from '@/context';
import { getClickForUrl } from '@/db/apiClicks';
import { deleteUrl, getUrl } from '@/db/apiUrl';
import useFetch from '@/hooks/useFetch';
import { LinkIcon } from 'lucide-react';
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners';
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Copy, Download, Trash } from 'lucide-react'
import Location from '@/components/Location';
import DeviceStats from '@/components/DeviceStats';

const Link = () => {
   const downloadImage = ()=>{
    alert("click")
   const imageUrl = url?.qr;
   const fileName = url?.title;

   const anchor = document.createElement("a")
   anchor.href(imageUrl)
   anchor.download(fileName)
   document.body.appendChild(anchor)
   anchor.click();
   document.body.removeChild(anchor)
  }

  const navigate =useNavigate();
  const {user} = urlState()
  const {id} = useParams()

  const {loading, data:url, fn, error} = useFetch(getUrl,{id,user_id:user?.id})

  const {loading:loadingStats, data:clickData, fn:fnClick, error:clickError} = useFetch(getClickForUrl,id)

  const {loading:loadingDelete, fn:fnDelete} = useFetch(deleteUrl, id)
  console.log(id)
  useEffect(()=>{
    fn();
  },[])

  useEffect(()=>{
    if(!error && loading === false){
      console.log("bb")
      fnClick();
    }
  },[loading,error])

  if(error){
    navigate("/dashboard")
  }

  let link ="";

  if(url){
    link = url?.custom_url ? url?.custom_url: url?.short_url;
  }

  return (
    <>
      {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}
      <div className="flex flex-col gap-8 sm:flex-row justify-between">
        <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
          <span className="text-6xl font-extrabold hover:underline cursor-pointer">
            {url?.title}
          </span>
          <a
            href={link}
            target="_blank"
            className="text-3xl sm:text-4xl text-blue-400 font-bold hover:underline cursor-pointer"
          >
           {link}
          </a>
          <a
            href={url?.original_url}
            target="_blank"
            className="flex items-center gap-1 hover:underline cursor-pointer"
          >
            <LinkIcon className="p-1" />
            {url?.original_url}
          </a>
          <span className="flex items-end font-extralight text-sm">
            {new Date(url?.created_at).toLocaleString()}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() =>
                navigator.clipboard.writeText(`https://trimrr.in/${link}`)
              }
            >
              <Copy />
            </Button>
            <Button variant="ghost" onClick={downloadImage}>
              <Download />
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                fnDelete().then(() => {
                  navigate("/dashboard");
                })
              }
              disable={loadingDelete}
            >
              {loadingDelete ? (
                <BeatLoader size={5} color="white" />
              ) : (
                <Trash />
              )}
            </Button>
          </div>
          <img
            src={url?.qr}
            className="w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain"
            alt="qr code"
          />
        </div>

        <Card className="sm:w-3/5">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold">Stats</CardTitle>
          </CardHeader>
          {clickData && clickData.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{clickData?.length}</p>
                </CardContent>
              </Card>

              <CardTitle>Location Data</CardTitle>
              <Location stats={clickData} />
              <CardTitle>Device Info</CardTitle>
              <DeviceStats stats={clickData} />
            </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false
                ? "No Statistics yet"
                : "Loading Statistics.."}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  )
}

export default Link
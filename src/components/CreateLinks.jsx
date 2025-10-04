import React, { useEffect, useRef, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import {createUrl} from "@/db/apiUrl";
import { urlState } from '@/context'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import * as yup from "yup";
import Error from '@/components/Error'
import QRCode from 'react-qrcode-logo';
import { BeatLoader } from 'react-spinners';
import useFetch from "@/hooks/useFetch";

const CreateLinks = () => {
    const { user } = urlState();
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    const longlink = searchParams.get("createNew")
    const [error,setError]= useState({});
    const ref= useRef();
    const [formValues, setFormValues] = useState({
        title:"",
        longUrl:longlink ? longlink :'',
        customUrl:"",
    })

    const schema = yup.object().shape({
        title:yup.string().required("Title is required"),
        longUrl:yup.string().url("Must be valid URL").required("Long URL is Required"),
        customUrl:yup.string(),
    })

    const  handleChange = ((e)=>{
       setFormValues({
        ...formValues,
        [e.target.id]:e.target.value,
       })
    })

    const {loading, error:urlError ,data, fn:fnCreateUrl} = useFetch(createUrl,{...formValues, user_id:user.id})
    
    useEffect(()=>{
      if(urlError === null && data){
        console.log(data[0])
        navigate(`/link/${data[0].id}`)
      }
    },[urlError,data])

    const createNewLink = async() =>{
          setError([]);
          try{
            await schema.validate(formValues,{abortEarly:false})
            const canvas  = ref.current.canvasRef.current;
            const blob = await new Promise((resolve)=>canvas.toBlob(resolve))
            await fnCreateUrl(blob)
          }catch(e){
            const newErrors = {};
            e?.inner?.forEach((err)=>{
                newErrors[err.path] = err.message
            })
            setError(newErrors)
        }
    }

    return (
        <div>
            <Dialog defaultOpen={longlink} onOpenChange={(res)=>{if (!res) setSearchParams({})}}>
                <DialogTrigger><Button variant='destructive'>Create Links</Button></DialogTrigger>
                <DialogContent className='sm:max-w-md'>
                    <DialogHeader>
                        <DialogTitle className='font-bold text-2xl'>Create New</DialogTitle>
                    </DialogHeader>
                    {
                        formValues?.longUrl && (
                            <QRCode value={formValues.longUrl} size={250} ref={ref}/>
                        )
                    }
                    <Input value={formValues.title} id="title" onChange={handleChange} placeholder="Short Link's Title" />
                    {error.title && <Error message={error.title} />}

                    <Input value={formValues.longUrl} id="longUrl" onChange={handleChange} placeholder="Enter You Long URL" />
                    {error.longUrl && <Error message={error.longUrl} />}
                    <div className='flex items-center gap-2'>
                        <Card className='p-2'>trimmer.in</Card>
                        <Input value={formValues.customUrl} id="customUrl" onChange={handleChange} placeholder="Custom Link (optional)" />
                    </div>
                    {error.customUrl && <Error message={error.customUrl} />}
                    <DialogFooter>
                        <Button disabled={loading} onClick={createNewLink} variant="destructive">
                           {loading ? <BeatLoader size={10} color="white"/>:"Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreateLinks
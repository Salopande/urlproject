import React, { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavigate, useSearchParams } from 'react-router-dom'
import Login from '@/components/Login'
import SignUp from '@/components/SignUp'
import { urlState } from '@/context'

const Auth = () => {
  const [searchParams] = useSearchParams()
  const longLink = searchParams.get("createNew")
  const navigate = useNavigate();
  const {loading, isAuthenticated} = urlState()

  useEffect(()=>{
    if(isAuthenticated && !loading){
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` :''}`)
    }
  },[loading,isAuthenticated])

  return (
    <div className='mt-36 flex flex-col items-center gap-10'>
      <h1 className='text-4xl font-extrabold'>
        {longLink ? "Hold up Let's Login First...!":"Login/Signup"}
      </h1>

      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">SignUP</TabsTrigger>
        </TabsList>
        <TabsContent value="login"><Login/></TabsContent>
        <TabsContent value="signup"><SignUp/></TabsContent>
      </Tabs>
    </div>
  )
}

export default Auth
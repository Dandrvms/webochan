import Comment from "@/app/components/Comment"
import { prisma } from "@/libs/prisma"


async function getVersions({id}) {
  


  const versions = await prisma.comment_Versions.findMany({
    where: {
      commentId: Number(id)
    },
    orderBy: {
      date: 'desc'
    }
  })

  // const versions = await res.json()
  return versions

}


export default async function Versions({ params }) {
  const { id } = await params;

  const versions = await getVersions({id});
  const sortedVersions = versions
  .map(ver => ({
    ...ver,
    isComment: false
  }))

  
  return (

    <section>
      <div className=" flex flex-col items-center w-full h-full p-10">
        
        <div className="flex flex-col flex-grow w-full max-w-xl  py-10">
          <div className="flex flex-col items-center w-full h-full">
          <p>El mensaje ha sido editado</p>
          </div>
      
          {
            
              

              sortedVersions.map((version) => (
                
                <Comment comment={version} key={version.id}/>
              ))


          }
        </div>


      </div>



    </section>
  );
}
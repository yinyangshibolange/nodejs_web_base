const { PrismaClient } =  require('@prisma/client')

module.exports = function (dbName){
 const prisma = new PrismaClient()
 return prisma[dbName]
}
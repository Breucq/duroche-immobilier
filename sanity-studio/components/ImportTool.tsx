import React, { useState } from 'react'
import {Box, Card, Container, Heading, Text, TextInput, Button, Stack, Label, Grid, Flex, Spinner} from '@sanity/ui'
import {useClient} from 'sanity'
import {nanoid} from 'nanoid'

export default function ImportTool() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState('')
  const [successId, setSuccessId] = useState('')

  const client = useClient({apiVersion: '2023-05-03'})

  const handleAnalyze = async () => {
    if (!url) return
    setIsLoading(true)
    setError('')
    setData(null)
    setSuccessId('')

    try {
      // On utilise l'API de production pour le scraping
      // Si vous êtes en local, assurez-vous que cette URL est accessible ou utilisez localhost:3000
      const apiUrl = `https://duroche.fr/api/scrape?url=${encodeURIComponent(url)}`
      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'analyse')
      }
      
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError("Impossible d'analyser cette URL. Vérifiez qu'elle est correcte.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const uploadImage = async (imageUrl: string) => {
    try {
      // Note: Cela peut échouer si l'image source a des protections CORS strictes
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const asset = await client.assets.upload('image', blob)
      return {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id
        }
      }
    } catch (e) {
      console.error("Échec upload image", e)
      return null
    }
  }

  const handleCreate = async () => {
    if (!data) return
    setIsCreating(true)

    try {
      // 1. Upload de l'image principale
      let mainImage = null
      if (data.images && data.images.length > 0) {
        mainImage = await uploadImage(data.images[0])
      }

      // 2. Upload des images supplémentaires (max 5 pour l'exemple pour ne pas être trop long)
      const additionalImages = []
      if (data.images && data.images.length > 1) {
        const otherImages = data.images.slice(1, 6)
        for (const imgUrl of otherImages) {
          const imgAsset = await uploadImage(imgUrl)
          if (imgAsset) additionalImages.push(imgAsset)
        }
      }

      // 3. Création du document
      const doc = {
        _type: 'property',
        title: data.title, // Sanity n'utilise pas title par défaut dans votre schema mais location/price
        // Mapping des champs selon votre schema property.ts
        type: data.type || 'Maison',
        status: 'Disponible',
        price: data.price,
        location: data.location || 'Vaucluse',
        area: data.surface,
        rooms: data.rooms,
        bedrooms: data.bedrooms,
        description: data.description,
        reference: data.reference || nanoid(6).toUpperCase(),
        publicationDate: new Date().toISOString(),
        image: mainImage,
        images: additionalImages,
        isHidden: true // On le crée caché par sécurité
      }

      const createdDoc = await client.create(doc)
      setSuccessId(createdDoc._id)
      setData(null)
      setUrl('')
    } catch (err: any) {
      setError(`Erreur lors de la création : ${err.message}`)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Container width={2} padding={4}>
      <Card padding={4} radius={2} shadow={1} tone="transparent">
        <Stack space={4}>
          <Heading as="h2" size={3}>Importer un bien via URL</Heading>
          <Text size={2} muted>Copiez l'URL d'une annonce (Groupement Immo, etc.) pour créer automatiquement un brouillon dans Sanity.</Text>
          
          <Grid columns={[1, 1, 12]} gap={2}>
            <Box columnStart={[1, 1, 1]} columnEnd={[1, 1, 10]}>
              <TextInput 
                value={url} 
                onChange={(e) => setUrl(e.currentTarget.value)} 
                placeholder="https://www.groupementimmo.fr/..." 
              />
            </Box>
            <Box columnStart={[1, 1, 10]} columnEnd={[1, 1, 13]}>
              <Button 
                text={isLoading ? "Analyse..." : "Analyser"} 
                tone="primary" 
                onClick={handleAnalyze} 
                disabled={isLoading || !url}
                width="fill"
              />
            </Box>
          </Grid>

          {error && (
            <Card padding={3} radius={2} shadow={1} tone="critical">
              <Text size={1}>{error}</Text>
            </Card>
          )}

          {successId && (
            <Card padding={4} radius={2} shadow={1} tone="positive">
              <Stack space={3}>
                <Heading size={1}>Bien créé avec succès !</Heading>
                <Text>Le bien a été ajouté en mode "caché". Vous pouvez maintenant le vérifier et le publier.</Text>
                {/* Le lien dépend de votre structure d'URL Sanity, c'est une estimation */}
                <Button 
                  as="a" 
                  href={`/structure/property;${successId}`} 
                  text="Ouvrir le bien" 
                  tone="primary" 
                />
              </Stack>
            </Card>
          )}

          {isLoading && (
            <Flex justify="center" align="center" padding={5}>
              <Spinner />
            </Flex>
          )}

          {data && !successId && (
            <Card padding={4} radius={2} shadow={1} border>
              <Stack space={4}>
                <Heading size={2}>Résultat de l'analyse</Heading>
                
                <Grid columns={2} gap={4}>
                   <Stack space={2}>
                     <Label>Titre détecté</Label>
                     <Text weight="bold">{data.title}</Text>
                   </Stack>
                   <Stack space={2}>
                     <Label>Prix</Label>
                     <Text weight="bold">{new Intl.NumberFormat('fr-FR', {style: 'currency', currency: 'EUR'}).format(data.price)}</Text>
                   </Stack>
                   <Stack space={2}>
                     <Label>Localisation</Label>
                     <Text>{data.location}</Text>
                   </Stack>
                   <Stack space={2}>
                     <Label>Surface / Chambres</Label>
                     <Text>{data.surface} m² / {data.bedrooms} ch.</Text>
                   </Stack>
                </Grid>

                <Stack space={2}>
                  <Label>Description</Label>
                  <Card padding={3} border radius={2} style={{maxHeight: '150px', overflowY: 'auto'}}>
                    <Text size={1}>{data.description}</Text>
                  </Card>
                </Stack>

                <Stack space={2}>
                  <Label>Images détectées ({data.images.length})</Label>
                  <Grid columns={4} gap={2}>
                    {data.images.slice(0, 4).map((img: string, i: number) => (
                      <img key={i} src={img} style={{width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px'}} />
                    ))}
                  </Grid>
                  {data.images.length > 4 && <Text size={1} muted>+ {data.images.length - 4} autres images...</Text>}
                </Stack>

                <Button 
                  text={isCreating ? "Création en cours..." : "Créer le bien dans Sanity"} 
                  tone="positive" 
                  size={3}
                  onClick={handleCreate}
                  disabled={isCreating}
                />
              </Stack>
            </Card>
          )}
        </Stack>
      </Card>
    </Container>
  )
}
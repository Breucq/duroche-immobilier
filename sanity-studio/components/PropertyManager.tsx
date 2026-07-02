import React, {useState, useEffect} from 'react'
import {
  Box,
  Card,
  Container,
  Heading,
  Text,
  Button,
  Stack,
  Flex,
  Grid,
  Checkbox,
  Badge,
  useToast,
  Spinner,
  Label,
  Select,
  TextInput,
} from '@sanity/ui'
import {useClient} from 'sanity'
import {useRouter} from 'sanity/router'

// --- Types ---
interface PropertyItem {
  _id: string
  reference: string
  type: string
  location: string
  price: number
  status: string
  isHidden: boolean
  imageUrl?: string
  _createdAt: string
}

export default function PropertyManager() {
  const [properties, setProperties] = useState<PropertyItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // --- Multi-Criteria Filters State ---
  const [statusFilter, setStatusFilter] = useState('all') // 'all', 'active', 'hidden', 'sold', 'underOffer'
  const [locationSearch, setLocationSearch] = useState('')
  const [refSearch, setRefSearch] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('newest') // 'newest', 'oldest', 'priceAsc', 'priceDesc'

  // --- Bulk Photo Uploader State ---
  const [editingProperty, setEditingProperty] = useState<PropertyItem | null>(null)
  const [propertyPhotos, setPropertyPhotos] = useState<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  const client = useClient({apiVersion: '2023-05-03'})
  const toast = useToast()
  const router = useRouter()

  // --- Fetch Data ---
  const fetchProperties = async () => {
    setIsLoading(true)
    try {
      const query = `*[_type == "property"] | order(_createdAt desc) {
        _id,
        reference,
        type,
        location,
        price,
        status,
        isHidden,
        "imageUrl": image.asset->url,
        _createdAt
      }`
      const data = await client.fetch(query)
      setProperties(data)
    } catch (err) {
      console.error(err)
      toast.push({title: 'Erreur de chargement', status: 'error'})
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  // --- Selection Logic ---
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === sortedProperties.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(sortedProperties.map((p) => p._id)))
    }
  }

  // --- Bulk Actions ---
  const handleBulkDelete = async () => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir SUPPRIMER DÉFINITIVEMENT ${selectedIds.size} bien(s) ? Cette action est irréversible.`,
      )
    ) {
      return
    }

    setIsLoading(true)
    const tx = client.transaction()
    selectedIds.forEach((id) => tx.delete(id))

    try {
      await tx.commit()
      toast.push({
        title: `${selectedIds.size} biens supprimés`,
        status: 'success',
      })
      setSelectedIds(new Set())
      fetchProperties()
    } catch (err) {
      toast.push({title: 'Erreur lors de la suppression', status: 'error'})
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkStatusChange = async (
    newStatus: string,
    isHidden: boolean,
  ) => {
    setIsLoading(true)
    const tx = client.transaction()
    selectedIds.forEach((id) =>
      tx.patch(id, {set: {status: newStatus, isHidden: isHidden}}),
    )

    try {
      await tx.commit()
      toast.push({title: 'Statuts mis à jour', status: 'success'})
      setSelectedIds(new Set())
      fetchProperties()
    } catch (err) {
      toast.push({title: 'Erreur mise à jour', status: 'error'})
    } finally {
      setIsLoading(false)
    }
  }

  // --- Navigation ---
  const handleEdit = (id: string) => {
    router.navigateIntent('edit', {id, type: 'property'})
  }

  // --- Multi-Criteria Filtering ---
  const filteredProperties = properties.filter((p) => {
    // Status Filter
    if (statusFilter === 'active' && (p.isHidden || p.status === 'Vendu')) return false
    if (statusFilter === 'hidden' && !p.isHidden) return false
    if (statusFilter === 'sold' && p.status !== 'Vendu') return false
    if (statusFilter === 'underOffer' && p.status !== 'Sous offre') return false

    // Location / Ville search
    if (locationSearch && !p.location?.toLowerCase().includes(locationSearch.toLowerCase())) {
      return false
    }

    // Reference search
    if (refSearch && !p.reference?.toLowerCase().includes(refSearch.toLowerCase())) {
      return false
    }

    // Min Price
    if (minPrice && p.price < Number(minPrice)) {
      return false
    }

    // Max Price
    if (maxPrice && p.price > Number(maxPrice)) {
      return false
    }

    return true
  })

  // --- Sorting ---
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
    if (sortBy === 'oldest') return new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime()
    if (sortBy === 'priceAsc') return a.price - b.price
    if (sortBy === 'priceDesc') return b.price - a.price
    return 0
  })

  // --- Photo Uploader Functions ---
  const refreshPropertyPhotos = async () => {
    if (!editingProperty) return
    try {
      const query = `*[_id == $id][0] {
        _id,
        reference,
        image,
        "imageUrl": image.asset->url,
        images,
        "galleryImages": images[] {
          _key,
          "assetId": asset->_id,
          "url": asset->url
        }
      }`
      const data = await client.fetch(query, {id: editingProperty._id})
      setPropertyPhotos(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (editingProperty) {
      refreshPropertyPhotos()
    } else {
      setPropertyPhotos(null)
    }
  }, [editingProperty])

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!editingProperty || !files || files.length === 0) return
    setIsUploading(true)

    try {
      const uploadedAssets: any[] = []
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`Téléchargement de la photo ${i + 1} sur ${files.length}...`)
        const asset = await client.assets.upload('image', files[i])
        uploadedAssets.push({
          _key: Math.random().toString(36).substring(2, 9),
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id
          }
        })
      }

      setUploadProgress('Enregistrement des modifications...')

      const doc = await client.getDocument(editingProperty._id) as any
      const existingImages = doc?.images || []
      const newImages = [...existingImages, ...uploadedAssets]

      const patches: any = {
        images: newImages
      }

      // S'il n'y a pas d'image de couverture, on prend la première uploadée
      if (!doc?.image && uploadedAssets.length > 0) {
        patches.image = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: uploadedAssets[0].asset._ref
          }
        }
      }

      await client.patch(editingProperty._id).set(patches).commit()
      toast.push({title: 'Photos ajoutées avec succès !', status: 'success'})

      refreshPropertyPhotos()
      fetchProperties()
    } catch (err) {
      console.error(err)
      toast.push({title: 'Échec du téléchargement', status: 'error'})
    } finally {
      setIsUploading(false)
      setUploadProgress('')
    }
  }

  const handleRemoveImage = async (index: number, isCover: boolean, assetId?: string) => {
    if (!editingProperty) return
    if (isCover) {
      if (confirm("Voulez-vous supprimer l'image de couverture principale ?")) {
        await client.patch(editingProperty._id).unset(['image']).commit()
        toast.push({title: 'Image de couverture supprimée', status: 'success'})
        refreshPropertyPhotos()
        fetchProperties()
      }
    } else {
      if (confirm('Voulez-vous retirer cette photo de la galerie ?')) {
        const doc = await client.getDocument(editingProperty._id) as any
        const existingImages = doc?.images || []
        const newImages = existingImages.filter((_: any, idx: number) => idx !== index)

        await client.patch(editingProperty._id).set({images: newImages}).commit()
        toast.push({title: 'Photo retirée', status: 'success'})
        refreshPropertyPhotos()
        fetchProperties()
      }
    }
  }

  const handleSetAsCover = async (assetRefId: string) => {
    if (!editingProperty || !assetRefId) return
    try {
      await client.patch(editingProperty._id).set({
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: assetRefId
          }
        }
      }).commit()
      toast.push({title: 'Image de couverture mise à jour !', status: 'success'})
      refreshPropertyPhotos()
      fetchProperties()
    } catch (err) {
      console.error(err)
      toast.push({title: 'Erreur', status: 'error'})
    }
  }

  // --- Render Helpers ---
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price)

  return (
    <Container width={4} padding={4}>
      <Stack space={4}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading as="h1" size={3}>
            Gestion Immobilière & Filtres Avancés
          </Heading>
          <Button
            mode="ghost"
            text="Actualiser"
            onClick={fetchProperties}
            disabled={isLoading}
          />
        </Flex>

        {/* Multi-Criteria Advanced Filter Panel */}
        <Card padding={3} radius={2} shadow={1} border>
          <Stack space={3}>
            <Grid columns={[1, 2, 6]} gap={3}>
              {/* Filtre Statut */}
              <Stack space={2}>
                <Label size={1}>Statut</Label>
                <Select
                  fontSize={2}
                  padding={2}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.currentTarget.value)}
                >
                  <option value="all">Tous les biens</option>
                  <option value="active">Actifs (En ligne)</option>
                  <option value="hidden">Cachés (Brouillons)</option>
                  <option value="sold">Vendus</option>
                  <option value="underOffer">Sous offre</option>
                </Select>
              </Stack>

              {/* Recherche Ville */}
              <Stack space={2}>
                <Label size={1}>Ville / Secteur</Label>
                <TextInput
                  placeholder="ex: Orange, Caderousse"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.currentTarget.value)}
                />
              </Stack>

              {/* Recherche Réf */}
              <Stack space={2}>
                <Label size={1}>Référence</Label>
                <TextInput
                  placeholder="ex: D84"
                  value={refSearch}
                  onChange={(e) => setRefSearch(e.currentTarget.value)}
                />
              </Stack>

              {/* Prix Min */}
              <Stack space={2}>
                <Label size={1}>Prix Min (€)</Label>
                <TextInput
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.currentTarget.value)}
                />
              </Stack>

              {/* Prix Max */}
              <Stack space={2}>
                <Label size={1}>Prix Max (€)</Label>
                <TextInput
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.currentTarget.value)}
                />
              </Stack>

              {/* Tri */}
              <Stack space={2}>
                <Label size={1}>Trier par</Label>
                <Select
                  fontSize={2}
                  padding={2}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.currentTarget.value)}
                >
                  <option value="newest">Création (Plus récent)</option>
                  <option value="oldest">Création (Plus ancien)</option>
                  <option value="priceAsc">Prix croissant</option>
                  <option value="priceDesc">Prix décroissant</option>
                </Select>
              </Stack>
            </Grid>

            {/* Clear Filters Button */}
            <Flex justify="space-between" align="center" style={{paddingTop: '5px'}}>
              <Text size={1} muted>
                {sortedProperties.length} bien(s) filtré(s) / {properties.length} total
              </Text>
              {(statusFilter !== 'all' || locationSearch || refSearch || minPrice || maxPrice || sortBy !== 'newest') && (
                <Button
                  fontSize={1}
                  text="Réinitialiser les filtres"
                  tone="caution"
                  mode="bleed"
                  onClick={() => {
                    setStatusFilter('all')
                    setLocationSearch('')
                    setRefSearch('')
                    setMinPrice('')
                    setMaxPrice('')
                    setSortBy('newest')
                  }}
                />
              )}
            </Flex>
          </Stack>
        </Card>

        {/* Toolbar for selections */}
        {selectedIds.size > 0 && (
          <Card padding={3} radius={2} shadow={1} tone="primary" border>
            <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
              <Flex gap={2} align="center">
                <Text size={1} weight="bold">
                  {selectedIds.size} sélectionné(s) :
                </Text>
                <Button
                  text="Mettre en ligne"
                  tone="positive"
                  mode="ghost"
                  fontSize={1}
                  onClick={() => handleBulkStatusChange('Disponible', false)}
                />
                <Button
                  text="Cacher"
                  tone="caution"
                  mode="ghost"
                  fontSize={1}
                  onClick={() => handleBulkStatusChange('Disponible', true)}
                />
                <Button
                  text="Marquer Vendu"
                  mode="ghost"
                  fontSize={1}
                  onClick={() => handleBulkStatusChange('Vendu', false)}
                />
                <Button
                  text="Supprimer"
                  tone="critical"
                  fontSize={1}
                  onClick={handleBulkDelete}
                />
              </Flex>
            </Flex>
          </Card>
        )}

        {/* Table / List */}
        <Card padding={0} radius={2} shadow={1} border>
          {isLoading ? (
            <Flex align="center" justify="center" padding={5}>
              <Spinner />
            </Flex>
          ) : (
            <Box>
              {/* Table Header */}
              <Grid
                columns={[6, 6, 12]}
                gap={2}
                padding={3}
                style={{borderBottom: '1px solid #e0e0e0', background: '#f9fafb'}}
              >
                <Box columnStart={1} columnEnd={2}>
                  <Checkbox
                    checked={
                      selectedIds.size > 0 &&
                      selectedIds.size === sortedProperties.length
                    }
                    indeterminate={
                      selectedIds.size > 0 &&
                      selectedIds.size < sortedProperties.length
                    }
                    onChange={toggleSelectAll}
                  />
                </Box>
                <Box columnStart={2} columnEnd={3}>
                  <Label>Image</Label>
                </Box>
                <Box columnStart={3} columnEnd={5}>
                  <Label>Référence / Type</Label>
                </Box>
                <Box columnStart={5} columnEnd={8}>
                  <Label>Localisation</Label>
                </Box>
                <Box columnStart={8} columnEnd={10}>
                  <Label>Prix</Label>
                </Box>
                <Box columnStart={10} columnEnd={11}>
                  <Label>Statut</Label>
                </Box>
                <Box columnStart={11} columnEnd={13} style={{textAlign: 'right'}}>
                  <Label>Actions</Label>
                </Box>
              </Grid>

              {/* Rows */}
              <Stack space={0}>
                {sortedProperties.map((p) => (
                  <Grid
                    key={p._id}
                    columns={[6, 6, 12]}
                    gap={2}
                    padding={3}
                    style={{
                      background: selectedIds.has(p._id) ? '#f0f9ff' : 'white',
                      opacity: p.isHidden ? 0.6 : 1,
                      alignItems: 'center',
                      borderBottom: '1px solid #e0e0e0'
                    }}
                  >
                    <Box columnStart={1} columnEnd={2}>
                      <Checkbox
                        checked={selectedIds.has(p._id)}
                        onChange={() => toggleSelect(p._id)}
                      />
                    </Box>

                    <Box columnStart={2} columnEnd={3}>
                      <div
                        style={{
                          width: '45px',
                          height: '45px',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          background: '#eee',
                        }}
                      >
                        {p.imageUrl && (
                          <img
                            src={`${p.imageUrl}?w=100&h=100&fit=crop`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        )}
                      </div>
                    </Box>

                    <Box columnStart={3} columnEnd={5}>
                      <Stack space={2}>
                        <Text size={1} weight="bold">
                          {p.reference || 'Sans Réf'}
                        </Text>
                        <Text size={1} muted>
                          {p.type}
                        </Text>
                      </Stack>
                    </Box>

                    <Box columnStart={5} columnEnd={8}>
                      <Text size={1}>{p.location}</Text>
                    </Box>

                    <Box columnStart={8} columnEnd={10}>
                      <Text size={1} weight="medium">
                        {formatPrice(p.price)}
                      </Text>
                    </Box>

                    <Box columnStart={10} columnEnd={11}>
                      <Flex gap={1} align="center">
                        {p.isHidden && (
                          <Badge tone="default" size={1}>
                            Caché
                          </Badge>
                        )}
                        {p.status === 'Vendu' && (
                          <Badge tone="critical" size={1}>
                            Vendu
                          </Badge>
                        )}
                        {p.status === 'Sous offre' && (
                          <Badge tone="caution" size={1}>
                            Sous Offre
                          </Badge>
                        )}
                        {p.status === 'Disponible' && !p.isHidden && (
                          <Badge tone="positive" size={1}>
                            En Ligne
                          </Badge>
                        )}
                      </Flex>
                    </Box>

                    <Box columnStart={11} columnEnd={13}>
                      <Flex gap={2} justify="flex-end">
                        <Button
                          fontSize={1}
                          mode="ghost"
                          text="Photos 📸"
                          onClick={() => setEditingProperty(p)}
                        />
                        <Button
                          fontSize={1}
                          mode="ghost"
                          text="Éditer"
                          onClick={() => handleEdit(p._id)}
                        />
                      </Flex>
                    </Box>
                  </Grid>
                ))}
                {sortedProperties.length === 0 && (
                  <Box padding={5}>
                    <Text align="center" muted>
                      Aucun bien trouvé pour ces filtres.
                    </Text>
                  </Box>
                )}
              </Stack>
            </Box>
          )}
        </Card>
      </Stack>

      {/* Custom Streamlined Bulk Photo Upload Overlay */}
      {editingProperty && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              background: 'white',
              width: '100%',
              maxWidth: '850px',
              borderRadius: '8px',
              padding: '24px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <Flex justify="space-between" align="center" style={{borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '20px'}}>
              <Heading as="h2" size={2}>
                Gestion des photos - Réf {editingProperty.reference || 'Sans Réf'}
              </Heading>
              <Button
                mode="ghost"
                text="Fermer ✕"
                onClick={() => setEditingProperty(null)}
              />
            </Flex>

            {/* Upload Area */}
            <Card
              border
              radius={2}
              padding={4}
              style={{
                textAlign: 'center',
                background: '#fafafa',
                borderStyle: 'dashed',
                borderWidth: '2px',
                borderColor: '#ccc',
                marginBottom: '24px',
                position: 'relative'
              }}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={isUploading}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: isUploading ? 'not-allowed' : 'pointer'
                }}
              />
              <Stack space={3}>
                <Text size={2} weight="bold">
                  {isUploading ? "Chargement en cours..." : "Glissez-déposez vos photos ici ou cliquez pour parcourir"}
                </Text>
                <Text size={1} muted>
                  Vous pouvez sélectionner plusieurs fichiers d'un coup (formats acceptés: JPG, PNG, WEBP).
                </Text>
                {isUploading && (
                  <Flex align="center" justify="center" gap={3}>
                    <Spinner />
                    <Text size={2} weight="bold" style={{color: '#b68d3d'}}>
                      {uploadProgress}
                    </Text>
                  </Flex>
                )}
              </Stack>
            </Card>

            {/* Current Photos Panel */}
            <Heading as="h3" size={1} style={{marginBottom: '12px'}}>
              Photos associées au bien
            </Heading>

            {propertyPhotos ? (
              <Stack space={4}>
                {/* 1. Couverture principale */}
                <Card border padding={3} radius={2} style={{background: '#fffbeb', borderColor: '#fde68a'}}>
                  <Heading as="h4" size={1} style={{marginBottom: '10px', color: '#b45309'}}>
                    Photo de Couverture Principale (Affichée en premier)
                  </Heading>
                  {propertyPhotos.imageUrl ? (
                    <Flex gap={4} align="center" wrap="wrap">
                      <img
                        src={`${propertyPhotos.imageUrl}?w=240&h=160&fit=crop`}
                        style={{borderRadius: '4px', objectFit: 'cover', width: '120px', height: '80px', border: '2px solid #b68d3d'}}
                      />
                      <Stack space={2}>
                        <Text size={1}>Cette image sert de couverture principale sur le site et l'index.</Text>
                        <Button
                          text="Supprimer la couverture"
                          tone="critical"
                          fontSize={1}
                          mode="ghost"
                          onClick={() => handleRemoveImage(0, true)}
                        />
                      </Stack>
                    </Flex>
                  ) : (
                    <Text size={1} muted>Aucune photo de couverture. Sélectionnez une photo ci-dessous pour la définir en tant que couverture.</Text>
                  )}
                </Card>

                {/* 2. Galerie */}
                <div>
                  <Heading as="h4" size={1} style={{marginBottom: '12px'}}>
                    Galerie photos ({propertyPhotos.galleryImages?.length || 0} images)
                  </Heading>
                  {propertyPhotos.galleryImages && propertyPhotos.galleryImages.length > 0 ? (
                    <Grid columns={[2, 3, 5]} gap={3}>
                      {propertyPhotos.galleryImages.map((img: any, index: number) => (
                        <Card key={img._key} border radius={2} padding={2} style={{background: '#f9fafb', position: 'relative'}}>
                          <img
                            src={`${img.url}?w=150&h=100&fit=crop`}
                            style={{width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px'}}
                          />
                          <Stack space={1}>
                            <Button
                              text="Définir Couverture"
                              fontSize={1}
                              mode="ghost"
                              onClick={() => handleSetAsCover(img.assetId)}
                            />
                            <Button
                              text="Retirer"
                              tone="critical"
                              fontSize={1}
                              mode="ghost"
                              onClick={() => handleRemoveImage(index, false)}
                            />
                          </Stack>
                        </Card>
                      ))}
                    </Grid>
                  ) : (
                    <Text size={1} muted>Aucune image dans la galerie photo secondaire.</Text>
                  )}
                </div>
              </Stack>
            ) : (
              <Flex align="center" justify="center" padding={4}>
                <Spinner />
              </Flex>
            )}
          </div>
        </div>
      )}
    </Container>
  )
}

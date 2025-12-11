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
  const [filter, setFilter] = useState('all') // 'all', 'active', 'hidden', 'sold'

  const client = useClient({apiVersion: '2023-05-03'})
  const toast = useToast()
  const router = useRouter()

  // --- Fetch Data ---
  const fetchProperties = async () => {
    setIsLoading(true)
    try {
      // On récupère les champs essentiels pour le tableau
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
    if (selectedIds.size === filteredProperties.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredProperties.map((p) => p._id)))
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
      fetchProperties() // Refresh list
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
    // Utilise l'API de navigation interne de Sanity Studio (intent)
    router.navigateIntent('edit', {id, type: 'property'})
  }

  // --- Filtering ---
  const filteredProperties = properties.filter((p) => {
    if (filter === 'all') return true
    if (filter === 'hidden') return p.isHidden
    if (filter === 'sold') return p.status === 'Vendu'
    if (filter === 'active') return !p.isHidden && p.status !== 'Vendu'
    return true
  })

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
            Gestion Immobilière
          </Heading>
          <Button
            mode="ghost"
            text="Actualiser"
            onClick={fetchProperties}
            disabled={isLoading}
          />
        </Flex>

        {/* Toolbar */}
        <Card padding={3} radius={2} shadow={1} border>
          <Flex
            justify="space-between"
            align="center"
            wrap="wrap"
            gap={3}
          >
            <Flex align="center" gap={3}>
              <Select
                fontSize={2}
                padding={3}
                value={filter}
                onChange={(e) => setFilter(e.currentTarget.value)}
              >
                <option value="all">Tous les biens</option>
                <option value="active">Actifs (En ligne)</option>
                <option value="hidden">Cachés (Brouillons)</option>
                <option value="sold">Vendus</option>
              </Select>
              <Text size={1} muted>
                {filteredProperties.length} bien(s)
              </Text>
            </Flex>

            {selectedIds.size > 0 && (
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
            )}
          </Flex>
        </Card>

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
                      selectedIds.size === filteredProperties.length
                    }
                    indeterminate={
                      selectedIds.size > 0 &&
                      selectedIds.size < filteredProperties.length
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
                <Box columnStart={10} columnEnd={12}>
                  <Label>Statut</Label>
                </Box>
                <Box columnStart={12} columnEnd={13}>
                  <Label>Action</Label>
                </Box>
              </Grid>

              {/* Rows */}
              <Stack space={0} dividers>
                {filteredProperties.map((p) => (
                  <Grid
                    key={p._id}
                    columns={[6, 6, 12]}
                    gap={2}
                    padding={3}
                    align="center"
                    style={{
                      background: selectedIds.has(p._id) ? '#f0f9ff' : 'white',
                      opacity: p.isHidden ? 0.6 : 1,
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
                          width: '40px',
                          height: '40px',
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

                    <Box columnStart={10} columnEnd={12}>
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

                    <Box columnStart={12} columnEnd={13}>
                      <Button
                        fontSize={1}
                        mode="ghost"
                        text="Éditer"
                        onClick={() => handleEdit(p._id)}
                      />
                    </Box>
                  </Grid>
                ))}
                {filteredProperties.length === 0 && (
                  <Box padding={5}>
                    <Text align="center" muted>
                      Aucun bien trouvé pour ce filtre.
                    </Text>
                  </Box>
                )}
              </Stack>
            </Box>
          )}
        </Card>
      </Stack>
    </Container>
  )
}
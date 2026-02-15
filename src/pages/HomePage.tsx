import exampleImage from 'figma:asset/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493.png';

export function HomePage() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      overflow: 'hidden'
    }}>
      {/* IMAGEN DE FONDO */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${exampleImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        opacity: 0.6,
        zIndex: 1
      }} />

      {/* OVERLAY VERDE - aplicado a toda la imagen */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(13, 31, 35, 0.85) 0%, rgba(19, 46, 53, 0.8) 50%, rgba(45, 74, 83, 0.75) 100%)',
        backdropFilter: 'blur(2px)',
        zIndex: 2
      }} />

      {/* CAPA DE TINTE VERDE */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(32, 64, 64, 0.4)',
        mixBlendMode: 'multiply' as const,
        zIndex: 2
      }} />
    </div>
  );
}

/**
 * Product detail pages get a "naked" layout — no Header/Footer.
 * The full-screen 3D viewer handles its own navigation (back arrow).
 */
export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

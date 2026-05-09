'use client';

import { useCallback } from 'react';
import Guitar from './objects/Guitar';
import Pedalboard from './objects/Pedalboard';
import CryBabyPedestal from './objects/CryBabyPedestal';
import PickJar from './objects/PickJar';
import Pegboard from './objects/Pegboard';
import CapoHook from './objects/CapoHook';
import SlideTray from './objects/SlideTray';
import StrapDrape from './objects/StrapDrape';
import CableCoil from './objects/CableCoil';
import StringsShelf from './objects/StringsShelf';
import Tshirt from './objects/Tshirt';
import Bookshelf from './objects/Bookshelf';
import FramedPhoto from './objects/FramedPhoto';
import Basket from './objects/Basket';

export default function Interactables() {
  const onSelect = useCallback((name: string) => {
    // Hook for future dive routing. Selection store is already updated by
    // useInteractable; this is just the per-object callback the spec asked for.
    if (typeof window !== 'undefined') {
      console.log('[room] selected:', name);
    }
  }, []);

  return (
    <group>
      <Guitar name="Vintage Guitar" category="hero" onSelect={onSelect} />
      <Pedalboard name="Pedalboard" category="electronics" onSelect={onSelect} />
      <CryBabyPedestal name="Cry Baby" category="heritage" onSelect={onSelect} />
      <PickJar name="Pick Jar" category="picks" onSelect={onSelect} />
      <Pegboard name="Pegboard" category="custom-picks" onSelect={onSelect} />
      <CapoHook name="Capos" category="capos" onSelect={onSelect} />
      <SlideTray name="Slides" category="slides" onSelect={onSelect} />
      <StrapDrape name="Strap" category="straps" onSelect={onSelect} />
      <CableCoil name="Cable Coil" category="cables" onSelect={onSelect} />
      <StringsShelf name="Strings Shelf" category="strings" onSelect={onSelect} />
      <Tshirt name="Dunlop T-Shirt" category="apparel" onSelect={onSelect} />
      <Bookshelf name="Records Shelf" category="artists" onSelect={onSelect} />
      <FramedPhoto name="Gold Record" category="heritage" onSelect={onSelect} />
      <Basket name="Basket" category="cart" onSelect={onSelect} />
    </group>
  );
}

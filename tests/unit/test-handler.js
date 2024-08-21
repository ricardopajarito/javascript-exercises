'use strict';
import { vi, describe, it, expect } from "vitest";
import memoization from "../../memoization.js";


describe('Prueba a memoization', function() {
    it('Entra a memoization', async () => {
        let memFunc = (a) => a * 2; 
        let fun = memoization(memFunc);
        console.log(fun(2));
    });
});